import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({ description: 'ID do kit' })
  @IsNotEmpty()
  @IsString()
  kitId: string;
}
