import { z } from 'zod';

const createTicketValidationSchema = z.object({
  body: z.object({
    busId: z.string().min(1, { message: 'Bus ID is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    seatNumber: z.number().min(1, { message: 'Seat number is required' }),
    date: z.string().min(1, { message: 'Arrival time is required' }),
  }),
});

export const TicketValidation = {
  createTicketValidationSchema,
};
