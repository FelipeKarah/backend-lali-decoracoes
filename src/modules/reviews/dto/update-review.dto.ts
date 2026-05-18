import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ description: 'Nota de 1 a 5', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: 'Comentário sobre o kit', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
