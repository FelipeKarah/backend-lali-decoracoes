// src/modules/payments/dto/create-card-payment.dto.ts
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsIn,
} from 'class-validator'

export class CreateCardPaymentDto {
  @IsString()
  token: string

  @IsString()
  issuer_id: string

  @IsString()
  @IsIn(['master', 'visa', 'amex', 'elo', 'hipercard', 'diners'])
  payment_method_id: string

  @IsNumber()
  @Min(1)
  transaction_amount: number

  @IsNumber()
  @Min(1)
  installments: number

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  external_reference: string

  @IsEmail()
  payer_email: string

  @IsString()
  @IsOptional()
  payer_document_type?: string

  @IsString()
  @IsOptional()
  payer_document_number?: string
}
