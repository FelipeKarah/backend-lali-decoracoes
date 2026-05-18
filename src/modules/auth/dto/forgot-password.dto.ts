import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
