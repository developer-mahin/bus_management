import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TicketServices } from './ticket.service';

const createTicket = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await TicketServices.createTicket(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    data: result,
    message: 'Ticket created successfully',
  });
});

export const TicketController = {
  createTicket,
};
