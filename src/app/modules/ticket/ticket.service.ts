/* eslint-disable @typescript-eslint/no-explicit-any */
import { addHours, addMinutes, format } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import { TICKET_STATUS } from '../../constant';
import AppError from '../../utils/AppError';
import { decodeToken } from '../../utils/decodeToken';
import Bus from '../bus/bus.model';
import { TTicket } from './ticket.interface';
import Ticket from './ticket.model';

const createTicket = async (
  token: string,
  payload: Omit<TTicket, 'isDeleted' | 'status' | 'purchasedBy'>,
) => {
  const { busId, price, departureTime, arrivalTime, seatNumber } = payload;

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

  const departureDate = new Date(departureTime.split(' ')[0]);
  const departureTimeString = departureTime.split(' ')[1];

  const arrivalDate = new Date(arrivalTime.split(' ')[0]);
  const arrivalTimeString = arrivalTime.split(' ')[1];

  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(departureDate, 'yyyy-MM-dd')}`,
        Number(departureTimeString.split(':')[0]),
      ),
      Number(departureTimeString.split(':')[1]),
    ),
  );

  const endDateTime = new Date(
    addMinutes(
      addHours(
        `${format(arrivalDate, 'yyyy-MM-dd')}`,
        Number(arrivalTimeString.split(':')[0]),
      ),
      Number(arrivalTimeString.split(':')[1]),
    ),
  );

  if (startDateTime.getTime() > endDateTime.getTime()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Departure time must be before arrival time',
    );
  }

  const existingTicket = await Ticket.findOne({
    busId,
    seatNumber,
    $or: [
      { departureTime: { $gte: startDateTime, $lt: endDateTime } },
      { arrivalTime: { $gt: startDateTime, $lte: endDateTime } },
    ],
  });

  if (existingTicket) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Seat already booked for this time',
    );
  }

  const admin = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  const ticket = await Ticket.create({
    busId,
    createdBy: admin.userId,
    price,
    departureTime: startDateTime,
    arrivalTime: endDateTime,
    seatNumber,
  });

  return ticket;
};

const purchaseTicket = async (token: string, payload: { ticketId: string }) => {
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

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      [{ $set: { status: TICKET_STATUS.SOLD, purchasedBy: user.userId } }],
      { session },
    );

    if (!updatedTicket) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to purchase ticket');
    }

    const updatedBus = await Bus.findOneAndUpdate(
      { _id: bus._id },
      [{ $inc: { availableSeats: -1 } }],
      { session },
    );

    if (!updatedBus) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to purchase ticket');
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to purchase ticket');
  }
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
      departureTime: { $eq: existingTicket.departureTime }, // Check for exact time match
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
  purchaseTicket,
  updateTicket,
  deleteTicket,
};
