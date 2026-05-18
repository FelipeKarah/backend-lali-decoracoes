import { Kit as KitModel, KitCategory, KitBadge } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class Kit implements KitModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  name: string;
  description: string;
  longDescription: string | null;
  icon: string;
  pricePerDay: number;
  rating: number;
  reviewsCount: number;
  badge: KitBadge | null;
  category: KitCategory;
  isActive: boolean;
  images: string[];
  imageBg: string | null;
  createdAt: Date;
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
