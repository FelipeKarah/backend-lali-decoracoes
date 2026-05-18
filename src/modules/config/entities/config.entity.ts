import { Config as ConfigModel } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';

export class Config implements ConfigModel {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  id: string;
  companyName: string;
  companyLogo: string | null;
  whatsappNumber: string;
  defaultCauction: number;
  barcodePrefix: string;
  emailSupport: string;
  address: string | null;
  workingHours: string | null;
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
