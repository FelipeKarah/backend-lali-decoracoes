import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreateReservationDto } from '../../dto/create-reservation.dto'
import { Reservation } from '../../entities/reservation.entity'
import { DeliveryType, PaymentMethod } from '@prisma/client'

@Injectable()
export class CreateReservationService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string, createReservationDto: CreateReservationDto) {
    const {
      startDate,
      endDate,
      days,
      items,
      notes,
      deliveryType,
      deliveryCep,
      shippingPrice,
      paymentMethod,
      paidOnline,
      mpPaymentId,
      totalAmount,
    } = createReservationDto

    let subtotal = 0

    // Separa os itens por tipo
    const kits = items.filter((item) => item.type === 'kit')
    const itensAvulsos = items.filter(
      (item) => item.type === 'item' || item.type === 'aluguel',
    )
    const complementos = items.filter(
      (item) => item.type === 'complemento' || item.type === 'consumivel',
    )

    // Calcula subtotal
    for (const kit of kits) {
      subtotal += (kit.price || 0) * (kit.quantity || 0) * days
    }

    for (const item of itensAvulsos) {
      subtotal += (item.price || 0) * (item.quantity || 0) * days
    }

    for (const comp of complementos) {
      subtotal += (comp.price || 0) * (comp.quantity || 0)
    }

    const shipping = shippingPrice && shippingPrice > 0 ? shippingPrice : 0
    const cauction = 0
    const calculatedTotal = subtotal + shipping + cauction
    const total = totalAmount && totalAmount > 0 ? totalAmount : calculatedTotal

    // Gerar código único da reserva
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    const reservationCode = `LALI-${timestamp}-${random}`

    // Criar reserva (sem kitId)
    const reservation = await this.prismaService.reservation.create({
      data: {
        reservationCode,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: Number(days),
        subtotal: Number(subtotal.toFixed(2)),
        cauction: Number(cauction.toFixed(2)),
        total: Number(total.toFixed(2)),
        notes: notes || null,
        status: 'PENDING',
        paymentStatus:
          paymentMethod === PaymentMethod.DINHEIRO
            ? 'PENDING'
            : paidOnline
              ? 'PAID'
              : 'PENDING',
        deliveryType: deliveryType || DeliveryType.RETIRADA,
        deliveryCep: deliveryCep || null,
        shippingPrice: Number(shipping.toFixed(2)),
        paymentMethod: paymentMethod || null,
        paidOnline: paidOnline || false,
        mpPaymentId: mpPaymentId || null,
      },
    })

    // Criar registros para os kits da reserva
    for (const kit of kits) {
      const itemCode = `${reservationCode}-KIT-${kit.id}-${Date.now()}`

      await this.prismaService.reservationKit.create({
        data: {
          reservationId: reservation.id,
          kitId: kit.id,
          name: kit.name,
          code: itemCode,
          quantity: kit.quantity,
          pricePerDay: Number(kit.price.toFixed(2)),
          days: Number(days),
          subtotal: Number((kit.price * kit.quantity * days).toFixed(2)),
          rentalType: 'ALUGUEL',
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      })
    }

    // Criar registros para itens avulsos (seu código existente)
    for (const item of itensAvulsos) {
      const itemCode = `${reservationCode}-ITEM-${item.id}-${Date.now()}`

      await this.prismaService.reservationItem.create({
        data: {
          reservationId: reservation.id,
          itemAvulsoId: item.id,
          name: item.name,
          code: itemCode,
          quantity: item.quantity,
          pricePerDay: Number(item.price.toFixed(2)),
          days: Number(days),
          subtotal: Number((item.price * item.quantity * days).toFixed(2)),
          rentalType: 'ALUGUEL',
        },
      })
    }

    // Criar registros para complementos
    for (const comp of complementos) {
      await this.prismaService.reservationComplemento.create({
        data: {
          reservationId: reservation.id,
          complementoId: comp.id,
          name: comp.name,
          price: Number(comp.price.toFixed(2)),
          quantity: comp.quantity,
          total: Number((comp.price * comp.quantity).toFixed(2)),
        },
      })
    }

    // Buscar reserva completa com todos os relacionamentos
    const completeReservation = await this.prismaService.reservation.findUnique(
      {
        where: { id: reservation.id },
        include: {
          kits: {
            include: { kit: true },
          },
          itens: {
            include: { itemAvulso: true },
          },
          complementos: {
            include: { complemento: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    )

    return new Reservation(completeReservation)
  }
}
