import { z } from 'zod';

const createTicketValidationSchema = z.object({
  body: z.object({
    busId: z.string().min(1, { message: 'Bus id is required' }),
    purchasedBy: z.string().min(1, { message: 'User id is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    departureTime: z.string().min(1, { message: 'Departure time is required' }),
    arrivalTime: z.string().min(1, { message: 'Arrival time is required' }),
    seatNumber: z.number().min(1, { message: 'Seat number is required' }),
    expireIn: z.string().min(1, { message: 'Expire in is required' }),
  }),
});

export const TicketValidation = {
  createTicketValidationSchema,
};
