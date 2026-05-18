import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

class DamageItemDto {
  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  discount: number;
}

export class FinalizeChecklistDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  damages?: DamageItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
