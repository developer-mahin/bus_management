import mongoose from 'mongoose';
import { TTicket } from './ticket.interface';

const ticketSchema = new mongoose.Schema<TTicket>(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus ID is required'],
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required'],
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Arrival time is required'],
    },
    seatNumber: {
      type: Number,
      required: [true, 'Seat number is required'],
    },
    expireIn: {
      type: Date,
      required: [true, 'Expire in is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Ticket = mongoose.model<TTicket>('Ticket', ticketSchema);
export default Ticket;
