import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddSugestaoDto {
  @ApiProperty({ example: 'complemento', description: 'Tipo: complemento ou item_avulso' })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: 'id-do-item', description: 'ID do complemento ou item avulso' })
  @IsNotEmpty()
  @IsString()
  itemId: string;
}
