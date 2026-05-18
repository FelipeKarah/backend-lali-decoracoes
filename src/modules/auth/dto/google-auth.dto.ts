import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Access token do Google' })
  token: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'URL da foto do perfil', required: false })
  picture?: string;
}
