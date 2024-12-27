import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import { convertDateAndTime } from '../../utils/convertInDateAndTime';
import Bus from '../bus/bus.model';
import { TTicket } from './ticket.interface';
import Ticket from './ticket.model';
import { decodeToken } from '../../utils/decodeToken';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';

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

export const TicketServices = {
  createTicket,
};
