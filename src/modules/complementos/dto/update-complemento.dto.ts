import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateComplementoDto } from './create-complemento.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateComplementoDto extends PartialType(CreateComplementoDto) {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
