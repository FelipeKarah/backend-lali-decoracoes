// services/pagbank.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';

@Injectable()
export class PagBankService {
  private readonly logger = new Logger(PagBankService.name);
  private readonly baseURL: string;
  private readonly sellerEmail: string;
  private readonly appKey: string;

  constructor() {
    // ✅ USE ESTAS CREDENCIAIS (que funcionaram no teste)
    this.sellerEmail = process.env.PAGBANK_SELLER_EMAIL || 'felipekarah@hotmail.com';
    this.appKey = process.env.PAGBANK_APP_KEY || '07A6819E5ED8488C81768B91BE5D8DFB';
    
    // ✅ URL CORRETA (sandbox pagseguro, não pagbank)
    this.baseURL = process.env.PAGBANK_BASE_URL || 'https://ws.sandbox.pagseguro.uol.com.br';
  }

  /**
   * Método V2 - Gera checkout PIX (QUE FUNCIONA)
   */
  async createPixPaymentV2(data: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerCpf: string;
    amount: number;
    description: string;
  }) {
    try {
      // Formatar dados para API V2 do PagBank
      const params = new URLSearchParams();
      
      // ✅ CREDENCIAIS CORRETAS
      params.append('email', this.sellerEmail);
      params.append('token', this.appKey);
      
      // Dados do pedido
      params.append('currency', 'BRL');
      params.append('reference', `ORDER_${data.orderId}`);
      
      // Dados do cliente
      params.append('senderName', data.customerName.substring(0, 50));
      params.append('senderEmail', data.customerEmail);
      params.append('senderCPF', this.formatCpf(data.customerCpf));
      
      // ✅ ITEM ÚNICO (simplificado)
      params.append('itemId1', `ITEM_${data.orderId}`);
      params.append('itemDescription1', data.description.substring(0, 100));
      params.append('itemAmount1', (data.amount / 100).toFixed(2)); // Converte de centavos para reais
      params.append('itemQuantity1', '1');
      
      // ✅ CONFIGURAÇÃO PIX (OBRIGATÓRIA)
      params.append('paymentMethod', 'pix');
      
      // URLs (opcional - configure no painel depois)
      if (process.env.APP_URL) {
        params.append('notificationURL', `${process.env.APP_URL}/api/payments/webhook/pagbank`);
      }
      
      if (process.env.FRONTEND_URL) {
        params.append('redirectURL', `${process.env.FRONTEND_URL}/order/${data.orderId}`);
      }

      this.logger.log(`Criando PIX V2 para pedido ${data.orderId}`);
      this.logger.debug(`Email: ${this.sellerEmail}, Token: ${this.appKey.substring(0, 8)}...`);

      // ✅ REQUISIÇÃO CORRETA
      const response = await axios.post(
        `${this.baseURL}/v2/checkout`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          },
          timeout: 30000,
        }
      );

      this.logger.debug(`Resposta PagBank: ${response.data.substring(0, 200)}...`);

      // Parse XML manualmente (mais simples que xml2js)
      const codeMatch = response.data.match(/<code>([^<]+)<\/code>/);
      const dateMatch = response.data.match(/<date>([^<]+)<\/date>/);
      
      if (codeMatch) {
        const checkoutCode = codeMatch[1];
        
        return {
          success: true,
          checkoutCode,
          paymentUrl: `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${checkoutCode}`,
          qrCodeUrl: this.generateQRCodeUrl(checkoutCode),
          rawResponse: response.data,
          createdAt: dateMatch ? dateMatch[1] : new Date().toISOString(),
        };
      } else {
        // Tentar extraer erro
        const errorMatch = response.data.match(/<error>[\s\S]*?<message>([^<]+)<\/message>/);
        throw new Error(errorMatch ? errorMatch[1] : 'Resposta inválida do PagBank');
      }

    } catch (error) {
      this.logger.error('Erro ao criar PIX V2:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      throw new Error(
        error.response?.data?.includes('Unauthorized') 
          ? 'Credenciais inválidas do PagBank. Verifique email e token.'
          : `Falha ao gerar PIX: ${error.message}`
      );
    }
  }

/**
 * Método para verificar transação por código do checkout (API V2)
 */
async checkTransaction(transactionCode: string) {
  try {
    // Para API V2 do PagBank, usamos este endpoint com credenciais
    const response = await axios.get(
      `${this.baseURL}/v2/transactions/${transactionCode}`,
      {
        params: {
          email: this.sellerEmail,
          token: this.appKey,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept': 'application/xml;charset=ISO-8859-1',
        },
        timeout: 10000,
      }
    );

    // Parse manual do XML
    const xml = response.data;
    
    // Função auxiliar para extrair valores do XML
    const getXmlValue = (tag: string) => {
      const match = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'i'));
      return match ? match[1] : null;
    };

    return {
      code: getXmlValue('code'),
      status: getXmlValue('status'),
      reference: getXmlValue('reference'),
      paymentMethod: getXmlValue('paymentMethod') || 'pix',
      grossAmount: getXmlValue('grossAmount'),
      netAmount: getXmlValue('netAmount'),
      lastEventDate: getXmlValue('lastEventDate'),
      rawXml: xml.substring(0, 500) + '...',
    };
    
  } catch (error: any) {
    this.logger.error('Erro ao verificar transação:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Se for erro 406, tenta com headers mais simples
    if (error.response?.status === 406) {
      return await this.checkTransactionFallback(transactionCode);
    }
    
    return null;
  }
}

/**
 * Fallback para consulta de transação (headers simplificados)
 */
private async checkTransactionFallback(transactionCode: string) {
  try {
    const response = await axios.get(
      `${this.baseURL}/v2/transactions/${transactionCode}`,
      {
        params: {
          email: this.sellerEmail,
          token: this.appKey,
        },
        // Headers mínimos
        headers: {
          'Accept': '*/*',
        },
      }
    );

    const xml = response.data;
    
    // Extrai status básico
    const statusMatch = xml.match(/<status>([^<]+)<\/status>/i);
    const referenceMatch = xml.match(/<reference>([^<]+)<\/reference>/i);
    
    return {
      code: transactionCode,
      status: statusMatch ? statusMatch[1] : 'UNKNOWN',
      reference: referenceMatch ? referenceMatch[1] : null,
      rawXml: xml.substring(0, 500) + '...',
    };
  } catch (error) {
    this.logger.error('Erro no fallback também:', error.message);
    return null;
  }
}

/**
 * Método SIMPLIFICADO para verificar status da transação
 */
async checkTransactionSimple(transactionCode: string) {
  try {
    console.log('realizar consulta simples')
    // Faz a consulta mais básica possível
    const response = await axios.get(
      `${this.baseURL}/v2/transactions/${transactionCode}`,
      {
        params: {
          email: this.sellerEmail,
          token: this.appKey,
        },
        // Headers mínimos para evitar erro 406
        headers: {},
      }
    );
    console.log('response', response)

    // Extrai apenas o status do XML
    const xml = response.data;
    const statusMatch = xml.match(/<status>([^<]+)<\/status>/i);
    
    if (!statusMatch) {
      return { status: 'UNKNOWN', code: transactionCode };
    }
    
    const status = statusMatch[1];
    
    // Mapeamento básico dos status
    const statusMap: Record<string, string> = {
      '1': 'AGUARDANDO_PAGAMENTO',
      '2': 'EM_ANALISE',
      '3': 'PAGA',
      '4': 'DISPONIVEL',
      '5': 'EM_DISPUTA',
      '6': 'DEVOLVIDA',
      '7': 'CANCELADA',
    };
    
    return {
      code: transactionCode,
      status: status,
      statusDesc: statusMap[status] || 'DESCONHECIDO',
      isPaid: status === '3' || status === '4',
    };
    
  } catch (error: any) {
    this.logger.error('Erro SIMPLES ao verificar transação:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data?.substring(0, 200),
    });
    
    return {
      code: transactionCode,
      status: 'ERROR',
      error: error.message,
    };
  }
}

/**
 * Método para consultar notificação (API V2)
 */
async checkNotification(notificationCode: string) {
  try {
    const response = await axios.get(
      `${this.baseURL}/v2/transactions/notifications/${notificationCode}`,
      {
        params: {
          email: this.sellerEmail,
          token: this.appKey,
        },
        headers: {
          'Accept': 'application/xml;charset=ISO-8859-1',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    this.logger.error('Erro ao verificar notificação:', {
      message: error.message,
      status: error.response?.status,
    });
    
    // Fallback simplificado
    try {
      const fallbackResponse = await axios.get(
        `${this.baseURL}/v2/transactions/notifications/${notificationCode}`,
        {
          params: {
            email: this.sellerEmail,
            token: this.appKey,
          },
          headers: {
            'Accept': '*/*',
          },
        }
      );
      
      return fallbackResponse.data;
    } catch (fallbackError) {
      throw new Error(`Não foi possível consultar notificação: ${error.message}`);
    }
  }
}

  /**
   * Gera QR Code a partir do código do PagBank
   */
  generateQRCodeUrl(code: string): string {
    // Gera QR Code usando serviço gratuito
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${code}`)}`;
  }

  /**
   * Formata CPF para o padrão do PagBank
   */
  private formatCpf(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      throw new Error('CPF inválido');
    }
    return cleaned;
  }

  /**
   * Teste de conexão com PagBank
   */
  async testConnection(): Promise<boolean> {
    try {
      // Teste simples criando um PIX de R$ 1,00
      const testPix = await this.createPixPaymentV2({
        orderId: `TEST_${Date.now()}`,
        customerName: 'Cliente Teste',
        customerEmail: 'c12345678901234567890@sandbox.pagseguro.com.br',
        customerCpf: '12345678909',
        amount: 100, // R$ 1,00 em centavos
        description: 'Teste de Conexão PagBank',
      });

      this.logger.log('✅ Conexão com PagBank estabelecida com sucesso');
      this.logger.debug(`Código checkout: ${testPix.checkoutCode}`);
      
      return true;
    } catch (error) {
      this.logger.error('❌ Falha na conexão com PagBank:', error.message);
      return false;
    }
  }

  /**
   * Cria PIX com múltiplos itens (se necessário)
   */
  async createPixWithMultipleItems(data: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerCpf: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      amount: number; // em centavos
    }>;
  }) {
    const params = new URLSearchParams();
    
    params.append('email', this.sellerEmail);
    params.append('token', this.appKey);
    params.append('currency', 'BRL');
    params.append('reference', `ORDER_${data.orderId}`);
    params.append('senderName', data.customerName.substring(0, 50));
    params.append('senderEmail', data.customerEmail);
    params.append('senderCPF', this.formatCpf(data.customerCpf));
    params.append('paymentMethod', 'pix');

    // Adiciona itens
    data.items.forEach((item, index) => {
      const num = index + 1;
      params.append(`itemId${num}`, item.id);
      params.append(`itemDescription${num}`, item.name.substring(0, 100));
      params.append(`itemAmount${num}`, (item.amount / 100).toFixed(2));
      params.append(`itemQuantity${num}`, item.quantity.toString());
    });

    // URLs
    if (process.env.APP_URL) {
      params.append('notificationURL', `${process.env.APP_URL}/api/payments/webhook/pagbank`);
    }

    const response = await axios.post(
      `${this.baseURL}/v2/checkout`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
        },
      }
    );

    const codeMatch = response.data.match(/<code>([^<]+)<\/code>/);
    if (!codeMatch) {
      throw new Error('Falha ao criar checkout com múltiplos itens');
    }

    return {
      success: true,
      checkoutCode: codeMatch[1],
      paymentUrl: `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${codeMatch[1]}`,
    };
  }
}