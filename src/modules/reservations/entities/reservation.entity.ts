import {
  Reservation as ReservationModel,
  ReservationStatus,
  PaymentStatus,
  DeliveryType,
  PaymentMethod,
} from '@prisma/client'
import { instanceToPlain } from 'class-transformer'

export class Reservation implements ReservationModel {
  constructor(data?: any) {
    Object.assign(this, data)
  }

  id: string
  reservationCode: string
  userId: string
  kitId: string | null
  startDate: Date
  endDate: Date
  days: number
  subtotal: number
  cauction: number
  total: number
  status: ReservationStatus
  paymentStatus: PaymentStatus
  paymentId: string | null
  paymentQrCode: string | null
  paymentCopiarCola: string | null
  notes: string | null
  cauctionReturnValue: number | null
  damageNotes: string | null

  // Novos campos para entrega e pagamento
  deliveryType: DeliveryType | null
  deliveryCep: string | null
  deliveryAddress: string | null
  deliveryNumber: string | null
  deliveryNeighborhood: string | null
  deliveryCity: string | null
  deliveryState: string | null
  shippingPrice: number | null
  paymentMethod: PaymentMethod | null
  paidOnline: boolean | null
  mpPaymentId: string | null

  createdAt: Date
  updatedAt: Date

  // Relacionamentos (opcionais)
  user?: any
  kit?: any
  itens?: any[]
  complementos?: any[]
  checklist?: any[]
  notifications?: any[]

  toJSON() {
    return instanceToPlain(this)
  }
}
