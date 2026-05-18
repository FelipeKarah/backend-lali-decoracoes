import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  password: string
}
