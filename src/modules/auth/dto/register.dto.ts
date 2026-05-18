import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'joao@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '11999990000', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string
}
