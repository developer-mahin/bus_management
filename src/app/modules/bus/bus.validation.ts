import { z } from 'zod';

const createBusValidationSchema = z.object({
  body: z.object({
    busName: z.string().min(1, { message: 'Bus name is required' }),
    busImage: z.string().min(1, { message: 'Bus image is required' }),
    capacity: z.number().min(1, { message: 'Capacity is required' }),
    busLicense: z.string().min(1, { message: 'Bus license is required' }),
    driverName: z.string().min(1, { message: 'Driver name is required' }),
    driverPhone: z.string().min(1, { message: 'Driver phone is required' }),
    description: z.string().optional(),
    route: z.string().min(1, { message: 'Route is required' }),
  }),
});

const updateBusValidationSchema = z.object({
  body: z.object({
    busName: z.string().min(1, { message: 'Bus name is required' }).optional(),
    busLicense: z
      .string()
      .min(1, { message: 'Bus license is required' })
      .optional(),
    busImage: z
      .string()
      .min(1, { message: 'Bus image is required' })
      .optional(),
    capacity: z.number().min(1, { message: 'Capacity is required' }).optional(),
    driverName: z
      .string()
      .min(1, { message: 'Driver name is required' })
      .optional(),
    driverPhone: z
      .string()
      .min(1, { message: 'Driver phone is required' })
      .optional(),
    description: z.string().optional(),
    route: z.string().min(1, { message: 'Route is required' }).optional(),
  }),
});

export const busValidationSchema = {
  createBusValidationSchema,
  updateBusValidationSchema,
};
