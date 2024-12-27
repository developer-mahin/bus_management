import { Types } from 'mongoose';
export type TTicketStatus = 'SOLD' | 'AVAILABLE' | 'EXPIRED';

export type TTicket = {
  busId: Types.ObjectId;
  purchasedBy: Types.ObjectId;
  createdBy: Types.ObjectId;
  fullName?: string;
  phoneNumber?: string;
  price: number;
  date: string;
  seatNumber: number;
  status: TTicketStatus;
  isDeleted: boolean;
};
  