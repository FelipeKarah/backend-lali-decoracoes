// src/modules/payments/services/create-card-payment.service.ts
import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreateCardPaymentDto } from '../../dto/create-card-payment.dto'

@Injectable()
export class CreateCardPaymentService {
  private readonly logger = new Logger(CreateCardPaymentService.name)
  private readonly mpBase = 'https://api.mercadopago.com/v1'
  private readonly mpToken: string
  private readonly isProduction: boolean

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.mpToken = this.configService.get<string>('MP_ACCESS_TOKEN')
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production'

    if (!this.mpToken) {
      this.logger.error('MP_ACCESS_TOKEN não configurado no .env')
    }
  }

  async execute(createCardDto: CreateCardPaymentDto) {
    try {
      // Log para debug
      this.logger.log(
        `Processando pagamento: ${createCardDto.external_reference}`,
      )
      this.logger.log(`Token MP: ${this.mpToken?.substring(0, 20)}...`)

      // ✅ Payload SIMPLES - baseado no teste que funcionou
      const payload: any = {
        transaction_amount: Number(createCardDto.transaction_amount.toFixed(2)),
        description: createCardDto.description || 'Pagamento Lali Moda',
        payment_method_id: createCardDto.payment_method_id,
        token: createCardDto.token,
        installments: Number(createCardDto.installments),
        issuer_id: createCardDto.issuer_id,
        payer: {
          email: createCardDto.payer_email,
        },
      }

      // ✅ Opcional: adicionar identification se for produção (ou se tiver os dados)
      if (createCardDto.payer_document_number && this.isProduction) {
        payload.payer.identification = {
          type: createCardDto.payer_document_type || 'CPF',
          number: createCardDto.payer_document_number.replace(/\D/g, ''),
        }
      }

      this.logger.log(
        `Payload enviado ao MP: ${JSON.stringify(payload, null, 2)}`,
      )

      const response = await axios.post(`${this.mpBase}/payments`, payload, {
        headers: {
          Authorization: `Bearer ${this.mpToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `lali-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      })

      const { data } = response

      this.logger.log(`Pagamento criado: ${data.id} - ${data.status}`)

      // Salvar no banco de dados
      await this.prismaService.payment.create({
        data: {
          mpPaymentId: String(data.id),
          externalReference: createCardDto.external_reference,
          method: 'card',
          status: data.status,
          amount: createCardDto.transaction_amount,
          installments: createCardDto.installments,
          cardBrand: createCardDto.payment_method_id,
        },
      })

      return {
        id: String(data.id),
        status: data.status,
        status_detail: data.status_detail,
        transaction_amount: data.transaction_amount,
        payment_method_id: data.payment_method_id,
        installments: data.installments,
      }
    } catch (err) {
      this.logger.error(`Erro ao processar cartão: ${err.message}`)

      if (err.response) {
        this.logger.error(`Status: ${err.response.status}`)
        this.logger.error(`Data: ${JSON.stringify(err.response.data)}`)
      }

      throw new HttpException(
        err.response?.data?.message ||
          'Erro ao processar cartão. Tente novamente.',
        err.response?.status || 500,
      )
    }
  }
}
