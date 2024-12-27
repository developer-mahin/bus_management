import { z } from 'zod';

const createTicketValidationSchema = z.object({
  body: z.object({
    busId: z.string().min(1, { message: 'Bus ID is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    seatNumber: z.number().min(1, { message: 'Seat number is required' }),
    date: z.string().min(1, { message: 'Arrival time is required' }),
  }),
});

const ticketPurchaseValidationSchema = z.object({
  body: z.object({
    ticketId: z.string().min(1, { message: 'Ticket ID is required' }),
    fullName: z.string().min(1, { message: 'Full name is required' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  }),
});

export const TicketValidation = {
  createTicketValidationSchema,
  ticketPurchaseValidationSchema
};
