import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ScanItemDto {
  @ApiProperty({ description: 'Código de barras do item', example: 'PM-001-0001' })
  @IsNotEmpty()
  @IsString()
  code: string;
}
