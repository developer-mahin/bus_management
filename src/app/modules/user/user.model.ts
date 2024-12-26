import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';
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
      trim: true,
    },
    profileImage: {
      type: String,
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

userSchema.pre('save', async function (next) {
  const user = this as IUser & Document;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  const user = this as IUser & Document;

  return await bcrypt.compare(enteredPassword, user.password);
};

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
