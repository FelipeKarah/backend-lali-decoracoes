import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'WhatsApp do usuário', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ description: 'Status do usuário', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
