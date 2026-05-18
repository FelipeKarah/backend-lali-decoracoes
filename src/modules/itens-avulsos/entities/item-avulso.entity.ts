import { ItemAvulso as ItemAvulsoModel, ItemCategory, RentalType } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class ItemAvulso implements ItemAvulsoModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string;
  category: ItemCategory;
  pricePerDay: number;
  replacementPrice: number;
  quantity: number;
  available: number;
  isActive: boolean;
  rentalType: RentalType;
  images: string[];
  createdAt: Date;
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
