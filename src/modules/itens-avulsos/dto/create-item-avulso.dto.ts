// backend/src/modules/itens-avulsos/dto/create-item-avulso.dto.ts

import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum ItemCategoryEnum {
  painel = 'painel',
  mesa = 'mesa',
  bandeja = 'bandeja',
  cadeira = 'cadeira',
  toalha = 'toalha',
  luminaria = 'luminaria',
  outros = 'outros',
}

export enum RentalTypeEnum {
  ALUGUEL = 'ALUGUEL',
  CONSUMIVEL = 'CONSUMIVEL',
}

export class CreateItemAvulsoDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    required: false,
    description: 'Emoji identificador (opcional)',
  })
  @IsString()
  @IsOptional()
  icon?: string

  @ApiProperty({ enum: ItemCategoryEnum })
  @IsEnum(ItemCategoryEnum)
  category: ItemCategoryEnum

  @ApiProperty()
  @IsNumber()
  @Min(0)
  pricePerDay: number

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  replacementPrice?: number

  @ApiProperty({ required: false, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number

  @ApiProperty({ enum: RentalTypeEnum, required: false })
  @IsEnum(RentalTypeEnum)
  @IsOptional()
  rentalType?: RentalTypeEnum

  @ApiProperty({
    type: [String],
    required: false,
    description: 'URLs das imagens retornadas pelo endpoint /upload/itens',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]
}
