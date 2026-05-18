import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ReservationStatus } from '../../../utils/enums';

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: ReservationStatus })
  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  cauctionReturnValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  damageNotes?: string;
}
