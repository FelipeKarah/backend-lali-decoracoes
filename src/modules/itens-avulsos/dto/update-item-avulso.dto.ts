import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateItemAvulsoDto } from './create-item-avulso.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateItemAvulsoDto extends PartialType(CreateItemAvulsoDto) {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
