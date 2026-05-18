import { ChecklistItem as ChecklistItemModel, ChecklistStatus } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class ChecklistItem implements ChecklistItemModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  reservationId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  scanned: boolean;
  scannedAt: Date | null;
  status: ChecklistStatus;
  damageNote: string | null;
  createdAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
