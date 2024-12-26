import { z } from 'zod';

export const registration = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3).max(50),
    email: z.string({ required_error: 'Email is required' }).email().max(50),
    password: z.string({ required_error: 'Password is required' }).min(8),
    contactNo: z.string({ required_error: 'Contact number is required' }),
    profileImage: z.string({ required_error: 'Profile image is required' }),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email().max(50),
    password: z.string({ required_error: 'Password is required' }).min(8),
  }),
});

export const AuthValidation = {
  registration,
  loginValidation,
};
