import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import { convertDateAndTime } from '../../utils/convertInDateAndTime';
import Bus from '../bus/bus.model';
import { TTicket } from './ticket.interface';
import Ticket from './ticket.model';
import { decodeToken } from '../../utils/decodeToken';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { TICKET_STATUS } from '../../constant';

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

  // create a function or any middleware for it
  // if the  departureTime will be exceed the arrivalTime then it will change the status of the ticket to Expired

  // Convert date strings to Date objects
  const convertedDepartureTime = convertDateAndTime(departureTime);
  const convertedArrivalTime = convertDateAndTime(arrivalTime);

  if (convertedDepartureTime >= convertedArrivalTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Departure time must be before arrival time',
    );
  }

  const existingTicket = await Ticket.findOne({
    busId,
    departureTime: { $eq: convertedDepartureTime }, // Check for exact time match
    seatNumber,
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
    departureTime: convertedDepartureTime,
    arrivalTime: convertedArrivalTime,
    seatNumber,
  });

  return ticket;
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
  const ticket = await Ticket.findByIdAndDelete(ticketId);
  if (!ticket) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
  }
  return ticket;
};

export const TicketServices = {
  createTicket,
  updateTicket,
  deleteTicket,
};
