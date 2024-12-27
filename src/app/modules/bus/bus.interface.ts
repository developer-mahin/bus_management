import { Types } from 'mongoose';

export type TBus = {
  userId: Types.ObjectId;
  busName: string;
  busNumber: string;
  busImage: string;
  driverName: string;
  driverPhone: string;
  seats: number;
  availableSeats?: number;
  description?: string;
  route: string;
  isDeleted: boolean;
};
