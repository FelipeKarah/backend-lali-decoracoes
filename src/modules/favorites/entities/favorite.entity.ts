import { Favorite as FavoriteModel } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class Favorite implements FavoriteModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  userId: string;
  kitId: string;
  createdAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
