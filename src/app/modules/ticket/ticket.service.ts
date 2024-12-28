/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { TICKET_STATUS } from '../../constant';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import AppError from '../../utils/AppError';
import { decodeToken } from '../../utils/decodeToken';
import Bus from '../bus/bus.model';
import {
  ticketFilterableFields,
  ticketSearchableFields,
} from './ticket.constant';
import { TTicket } from './ticket.interface';
import Ticket from './ticket.model';

const createTicket = async (
  token: string,
  payload: Omit<TTicket, 'isDeleted' | 'status' | 'purchasedBy'>,
) => {
  const { busId, price, date, seatNumber } = payload;

  const bus = await Bus.findById(busId);
  if (!bus) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
  }

  if (seatNumber < 1 || seatNumber > bus.seats) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Seat number must be between 1 and ${bus.seats}`, // Assuming bus.seats is the total number of seats
    );
  }

  const departureDate = new Date(date);

  const startDateTime = new Date(format(departureDate, 'yyyy-MM-dd'));

  const isTicketExist = await Ticket.findOne({
    busId,
    date: startDateTime,
    seatNumber,
  });

  if (isTicketExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ticket already exist');
  }

  const admin = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  const ticket = await Ticket.create({
    busId,
    createdBy: admin.userId,
    price,
    date: startDateTime,
    seatNumber,
  });

  return ticket;
};

const getAllTickets = async (query: Record<string, unknown>) => {
  const busQuery = new QueryBuilder(
    Ticket.find({})
      .populate({
        path: 'busId',
        model: 'Bus',
      })
      .populate({
        path: 'purchasedBy',
        model: 'User',
      }),
    query,
  )
    .search(ticketSearchableFields)
    .paginate()
    .filter(ticketFilterableFields)
    .sort();

  const result = await busQuery.queryModel;

  const meta = await busQuery.countTotal();

  return {
    result,
    meta: meta,
  };
};

const purchaseTicket = async (
  token: string,
  payload: { ticketId: string; phoneNumber: string; fullName: string },
) => {
  const user = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  const ticket = await Ticket.findById(payload.ticketId);
  if (!ticket) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  if (ticket.status !== TICKET_STATUS.AVAILABLE) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ticket is not available');
  }

  if (ticket.purchasedBy) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ticket is already purchased');
  }

  const bus = await Bus.findById(ticket.busId);
  if (!bus) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: ticket._id },
    {
      $set: {
        status: TICKET_STATUS.SOLD,
        purchasedBy: user.userId,
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
      },
    },
    { new: true },
  );

  return updatedTicket;
};

const updateTicket = async (ticketId: string, payload: Partial<TTicket>) => {
  const existingTicket = await Ticket.findById(ticketId);
  if (!existingTicket) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  // Check if the ticket is available for purchase
  if (existingTicket.status !== TICKET_STATUS.AVAILABLE) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ticket is not available');
  }

  // Check if the seat number has changed and is within the valid range for the bus
  if (payload.seatNumber) {
    const bus = await Bus.findById(existingTicket.busId);
    if (!bus) {
      throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
    }

    if (payload.seatNumber < 1 || payload.seatNumber > bus.seats) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Seat number must be between 1 and ${bus.seats}`, // Assuming bus.seats is the total number of seats
      );
    }
  }

  // Check if the seat number has changed and is already booked for the same time slot
  if (payload.seatNumber && existingTicket.seatNumber !== payload.seatNumber) {
    const ticket = await Ticket.findOne({
      busId: existingTicket.busId,
      date: { $eq: existingTicket.date }, // Check for exact time match
      seatNumber: payload.seatNumber,
    });

    if (ticket) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Seat already booked for this time',
      );
    }
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, payload, {
    new: true,
  });

  return updatedTicket;
};

const deleteTicket = async (ticketId: string) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  const result = await Ticket.findByIdAndUpdate(
    ticketId,
    { isDeleted: true, seatNumber: 0, status: TICKET_STATUS.EXPIRED },
    { new: true },
  );

  return result;
};

export const TicketServices = {
  createTicket,
  getAllTickets,
  purchaseTicket,
  updateTicket,
  deleteTicket,
};
