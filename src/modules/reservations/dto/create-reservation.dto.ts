// create-reservation.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'

enum DeliveryType {
  RETIRADA = 'RETIRADA',
  ENTREGA = 'ENTREGA',
}

enum PaymentMethod {
  PIX = 'PIX',
  CARTAO = 'CARTAO',
  DINHEIRO = 'DINHEIRO',
}

class ReservationItemDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsString()
  type: string // 'rental' | 'consumable'
}

export class CreateReservationDto {
  @ApiProperty({ example: '2025-06-15T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string

  @ApiProperty({ example: '2025-06-16T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  days: number

  @ApiProperty({ type: [ReservationItemDto] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReservationItemDto)
  items: ReservationItemDto[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  // Novos campos
  @ApiProperty({ required: false, enum: DeliveryType })
  @IsOptional()
  @IsEnum(DeliveryType)
  deliveryType?: DeliveryType

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deliveryCep?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  shippingPrice?: number

  @ApiProperty({ required: false, enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  paidOnline?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mpPaymentId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number
}
