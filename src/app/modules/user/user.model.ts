import mongoose from 'mongoose';
import { IUser } from './user.interface';

export const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: 0,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEACTIVATED', 'BLOCKED'],
      default: 'ACTIVE',
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
userSchema.pre('find', async function (next) {
  this.find({ isDeleted: false });
  next();
});

userSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
