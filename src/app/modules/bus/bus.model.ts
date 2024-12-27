import mongoose, { Schema } from 'mongoose';
import { TBus } from './bus.interface';

export const busSchema = new mongoose.Schema<TBus>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    busName: {
      type: String,
      required: [true, 'Bus name is required'],
      trim: true,
    },
    busImage: {
      type: String,
      required: [true, 'Bus image is required'],
    },

    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
    },
    seats: {
      type: Number,
      required: [true, 'seats is required'],
    },
    availableSeats: {
      type: Number,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver phone is required'],
      trim: true,
    },
    description: String,
    route: {
      type: String,
      required: [true, 'Route is required'],
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
busSchema.pre('find', async function (next) {
  this.find({ $and: [{ isDeleted: { $ne: true }, seats: { $gte: 1 } }] });
  next();
});

busSchema.pre('findOne', async function (next) {
  this.findOne({ $and: [{ isDeleted: { $ne: true }, seats: { $gte: 1 } }] });
  next();
});

busSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({
    $match: {
      $and: [{ isDeleted: { $ne: true } }, { seats: { $gte: 1 } }],
    },
  });
  next();
});

const Bus = mongoose.model<TBus>('Bus', busSchema);

export default Bus;
