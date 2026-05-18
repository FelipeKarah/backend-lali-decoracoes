import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID do kit', example: 'kit-id-aqui' })
  @IsNotEmpty()
  @IsString()
  kitId: string;

  @ApiProperty({ description: 'Nota de 1 a 5', example: 5, minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário sobre o kit', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'ID da reserva (opcional)', required: false })
  @IsOptional()
  @IsString()
  reservationId?: string;
}
