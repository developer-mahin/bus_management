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

const purchaseTicket = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await TicketServices.purchaseTicket(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    data: result,
    message: 'Ticket purchased successfully',
  });
});

const updateTicket = catchAsync(async (req, res) => {
  const { id: ticketId } = req.params;
  const result = await TicketServices.updateTicket(ticketId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Ticket updated successfully',
  });
});

const deleteTicket = catchAsync(async (req, res) => {
  const { id: ticketId } = req.params;
  const result = await TicketServices.deleteTicket(ticketId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Ticket deleted successfully',
  });
});

export const TicketController = {
  createTicket,
  purchaseTicket,
  updateTicket,
  deleteTicket,
};
