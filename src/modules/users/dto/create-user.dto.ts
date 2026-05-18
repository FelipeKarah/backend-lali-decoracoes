import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator'

export class CreateUserDto {
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

  @ApiProperty({ enum: UserRole, default: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
