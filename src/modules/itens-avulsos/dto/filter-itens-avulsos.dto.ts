import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemCategory, RentalType } from '../../../utils/enums';

export class FilterItensAvulsosDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: ItemCategory, required: false })
  @IsOptional()
  @IsEnum(ItemCategory)
  category?: ItemCategory;

  @ApiProperty({ enum: RentalType, required: false })
  @IsOptional()
  @IsEnum(RentalType)
  rentalType?: RentalType;
}
