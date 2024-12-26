import { Types } from 'mongoose';

export type TTicket = {
  busId: Types.ObjectId;
  purchasedBy: Types.ObjectId;
  price: number;
  departureTime: Date;
  arrivalTime: Date;
  seatNumber: number;
  expireIn: Date;
  isDeleted: boolean;
};
