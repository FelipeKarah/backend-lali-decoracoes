import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class DashboardFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  period?: 'week' | 'month' | 'year' = 'month'

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number
}
