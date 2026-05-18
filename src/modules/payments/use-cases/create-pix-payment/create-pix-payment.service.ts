// src/modules/payments/services/create-pix-payment.service.ts
import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreatePixPaymentDto } from '../../dto/create-pix-payment.dto'

@Injectable()
export class CreatePixPaymentService {
  private readonly logger = new Logger(CreatePixPaymentService.name)
  private readonly mpBase = 'https://api.mercadopago.com/v1'
  private readonly mpToken: string

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    // ✅ Pega o token do .env
    this.mpToken = this.configService.get<string>('MP_ACCESS_TOKEN')

    if (!this.mpToken) {
      this.logger.error('MP_ACCESS_TOKEN não configurado no .env')
    }
  }

  async execute(createPixDto: CreatePixPaymentDto) {
    try {
      // ✅ Valida se o token existe
      if (!this.mpToken) {
        throw new Error('Token do Mercado Pago não configurado')
      }

      this.logger.log(`Criando pagamento PIX para: ${createPixDto.payer_email}`)
      this.logger.log(`Token usado: ${this.mpToken.substring(0, 20)}...`)

      const payload = {
        transaction_amount: Number(createPixDto.transaction_amount.toFixed(2)),
        description: createPixDto.description || 'Lali Moda - Aluguel de Kits',
        payment_method_id: 'pix',
        external_reference: createPixDto.external_reference,
        payer: {
          email: createPixDto.payer_email,
          first_name: createPixDto.payer_first_name,
          last_name: createPixDto.payer_last_name,
          identification: {
            type: 'CPF',
            number: createPixDto.payer_document?.replace(/\D/g, '') ?? '',
          },
        },
      }

      this.logger.log(`Payload: ${JSON.stringify(payload, null, 2)}`)

      const response = await axios.post(`${this.mpBase}/payments`, payload, {
        headers: {
          Authorization: `Bearer ${this.mpToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `lali-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      })

      this.logger.log(`Resposta MP: ${response.status} - ${response.data.id}`)

      const { data } = response

      // Salva no banco
      await this.prismaService.payment.create({
        data: {
          mpPaymentId: String(data.id),
          externalReference: createPixDto.external_reference,
          method: 'pix',
          status: data.status,
          amount: createPixDto.transaction_amount,
          qrCode: data.point_of_interaction?.transaction_data?.qr_code ?? null,
          qrCodeBase64:
            data.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
        },
      })

      return {
        success: true,
        id: String(data.id),
        status: data.status,
        qr_code: data.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64:
          data.point_of_interaction?.transaction_data?.qr_code_base64,
        copy_paste: data.point_of_interaction?.transaction_data?.qr_code,
      }
    } catch (err) {
      this.logger.error(`Erro ao criar Pix: ${err.message}`)

      // Log detalhado do erro
      if (err.response) {
        this.logger.error(`Status: ${err.response.status}`)
        this.logger.error(`Data: ${JSON.stringify(err.response.data)}`)
      }

      throw new HttpException(
        err.response?.data?.message || 'Erro ao gerar Pix. Tente novamente.',
        err.response?.status || 500,
      )
    }
  }
}
