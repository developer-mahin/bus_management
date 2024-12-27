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
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    date: {
      type: String,
      required: [true, 'Arrival time is required'],
    },
    seatNumber: {
      type: Number,
      unique: true,
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
  this.find({ isDeleted: { $ne: true } });
  next();
});

ticketSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

ticketSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({
    $match: {
      isDeleted: { $ne: true },
    },
  });
  next();
});

const Ticket = mongoose.model<TTicket>('Ticket', ticketSchema);
export default Ticket;
