import { z } from 'zod';

const createBusValidationSchema = z.object({
  body: z.object({
    busName: z.string().min(1, { message: 'Bus name is required' }),
    busNumber: z.string().min(1, { message: 'Bus number is required' }),
    busImage: z.string().min(1, { message: 'Bus image is required' }),
    driverName: z.string().min(1, { message: 'Driver name is required' }),
    driverPhone: z.string().min(1, { message: 'Driver phone is required' }),
    seats: z.number().min(1, { message: 'Capacity is required' }),
    description: z.string().optional(),
    route: z.string().min(1, { message: 'Route is required' }),
  }),
});

const updateBusValidationSchema = z.object({
  body: z.object({
    busName: z.string().min(1, { message: 'Bus name is required' }).optional(),
    busNumber: z
      .string()
      .min(1, { message: 'Bus number is required' })
      .optional(),
    busImage: z
      .string()
      .min(1, { message: 'Bus image is required' })
      .optional(),
    driverName: z
      .string()
      .min(1, { message: 'Driver name is required' })
      .optional(),
    driverPhone: z
      .string()
      .min(1, { message: 'Driver phone is required' })
      .optional(),
    seats: z.number().min(1, { message: 'Capacity is required' }).optional(),
    description: z.string().optional(),
    route: z.string().min(1, { message: 'Route is required' }).optional(),
  }),
});

export const busValidationSchema = {
  createBusValidationSchema,
  updateBusValidationSchema,
};
