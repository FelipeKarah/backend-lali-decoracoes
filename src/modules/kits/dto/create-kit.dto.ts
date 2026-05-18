// backend/src/modules/kits/dto/create-kit.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
  ValidateNested,
  IsUUID,
  IsInt,
  IsPositive,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum KitCategory {
  infantil = 'infantil',
  princesa = 'princesa',
  esporte = 'esporte',
  natureza = 'natureza',
  adulto = 'adulto',
}

export enum KitBadge {
  hot = 'hot',
  new = 'new',
}

class KitItemDto {
  @IsUUID()
  itemAvulsoId: string

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number
}

export class CreateKitDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  @IsOptional()
  longDescription?: string

  @IsString()
  @IsOptional()
  icon?: string // emoji opcional — imagem principal vem pelo upload

  @IsNumber()
  @Min(0)
  pricePerDay: number

  @IsEnum(KitCategory)
  category: KitCategory

  @IsEnum(KitBadge)
  @IsOptional()
  badge?: KitBadge

  /**
   * URLs das imagens já processadas pelo endpoint POST /upload/kits
   * Ex: ["/uploads/kits/abc123.webp", "/uploads/kits/def456.webp"]
   * A primeira imagem é considerada a principal (capa do kit).
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  imageBg?: string // gradiente CSS fallback quando não há imagem

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KitItemDto)
  @IsOptional()
  items?: KitItemDto[]
}
