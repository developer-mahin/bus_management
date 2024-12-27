import { Types } from 'mongoose';
export type TTicketStatus = 'SOLD' | 'AVAILABLE' | 'EXPIRED';

export type TTicket = {
  busId: Types.ObjectId;
  createdBy: Types.ObjectId;
  purchasedBy: Types.ObjectId;
  price: number;
  departureTime: string;
  arrivalTime: string;
  seatNumber: number;
  status: TTicketStatus;
  isDeleted: boolean;
};
