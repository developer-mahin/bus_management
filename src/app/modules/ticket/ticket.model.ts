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
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    departureTime: {
      type: String,
      required: [true, 'Departure time is required'],
    },
    arrivalTime: {
      type: String,
      required: [true, 'Arrival time is required'],
    },
    seatNumber: {
      type: Number,
      required: [true, 'Seat number is required'],
    },
    status: {
      type: String,
      enum: ['SOLD', 'AVAILABLE', 'EXPIRED'],
      default: 'AVAILABLE',
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

// query middlewares
ticketSchema.pre('find', async function (next) {
  this.find({
    $and: [{ isDeleted: { $ne: true }, status: { $eq: 'AVAILABLE' } }],
  });
  next();
});

ticketSchema.pre('findOne', async function (next) {
  this.findOne({
    $and: [{ isDeleted: { $ne: true }, status: { $eq: 'AVAILABLE' } }],
  });
  next();
});

ticketSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({
    $match: {
      $and: [{ isDeleted: { $ne: true } }, { status: { $eq: 'AVAILABLE' } }],
    },
  });
  next();
});

const Ticket = mongoose.model<TTicket>('Ticket', ticketSchema);
export default Ticket;
