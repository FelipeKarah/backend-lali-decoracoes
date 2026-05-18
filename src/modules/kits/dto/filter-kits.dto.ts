import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { KitCategory } from '../../../utils/enums';

export class FilterKitsDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: KitCategory, required: false })
  @IsOptional()
  @IsEnum(KitCategory)
  category?: KitCategory;

  @ApiProperty({ required: false, default: 'popular' })
  @IsOptional()
  @IsString()
  sort?: string;
}
