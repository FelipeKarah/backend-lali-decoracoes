import { Review as ReviewModel } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class Review implements ReviewModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  userId: string;
  kitId: string;
  reservationId: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
