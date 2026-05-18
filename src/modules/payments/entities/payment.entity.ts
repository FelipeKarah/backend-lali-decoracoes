import { Payment as PaymentModel } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class Payment implements PaymentModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  mpPaymentId: string;
  externalReference: string;
  method: string;
  status: string;
  amount: number;
  installments: number | null;
  cardBrand: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  createdAt: Date;
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
