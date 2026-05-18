import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KitCategory, KitBadge } from '../../../utils/enums';

class KitItemDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  itemAvulsoId?: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}

export class UpdateKitDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDay?: number;

  @ApiProperty({ enum: KitCategory, required: false })
  @IsOptional()
  @IsEnum(KitCategory)
  category?: KitCategory;

  @ApiProperty({ enum: KitBadge, required: false })
  @IsOptional()
  @IsEnum(KitBadge)
  badge?: KitBadge;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageBg?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [KitItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KitItemDto)
  items?: KitItemDto[];
}
