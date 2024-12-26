import { Types } from 'mongoose';

export type TBus = {
  userId: Types.ObjectId;
  busName: string;
  busImage: string;
  busLicense: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  description?: string;
  route: string;
  isDeleted: boolean;
};
