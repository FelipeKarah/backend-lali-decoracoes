import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePixPaymentDto {
  @ApiProperty({ description: 'Valor da transação' })
  @IsNumber()
  @Min(0.01)
  transaction_amount: number;

  @ApiProperty({ description: 'Descrição do pagamento', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Referência externa (ex: reserva ID)' })
  @IsString()
  external_reference: string;

  @ApiProperty({ description: 'E-mail do pagador' })
  @IsEmail()
  payer_email: string;

  @ApiProperty({ description: 'Nome do pagador', required: false })
  @IsOptional()
  @IsString()
  payer_first_name?: string;

  @ApiProperty({ description: 'Sobrenome do pagador', required: false })
  @IsOptional()
  @IsString()
  payer_last_name?: string;

  @ApiProperty({ description: 'CPF/CNPJ do pagador', required: false })
  @IsOptional()
  @IsString()
  payer_document?: string;
}
