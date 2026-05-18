import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUrl, Min } from 'class-validator';

export class UpdateConfigDto {
  @ApiProperty({ required: false, example: 'Lali' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false, example: 'https://lali.com.br/logo.png' })
  @IsOptional()
  @IsUrl()
  companyLogo?: string;

  @ApiProperty({ required: false, example: '5511999990000' })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiProperty({ required: false, example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultCauction?: number;

  @ApiProperty({ required: false, example: 'PM' })
  @IsOptional()
  @IsString()
  barcodePrefix?: string;

  @ApiProperty({ required: false, example: 'oi@lali.com.br' })
  @IsOptional()
  @IsString()
  emailSupport?: string;

  @ApiProperty({ required: false, example: 'Rua Exemplo, 123 - Americana, SP' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h' })
  @IsOptional()
  @IsString()
  workingHours?: string;
}
