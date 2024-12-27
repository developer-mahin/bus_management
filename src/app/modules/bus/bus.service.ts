import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import { TBus } from './bus.interface';
import Bus from './bus.model';
import { decodeToken } from '../../utils/decodeToken';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { USER_ROLE } from '../../constant';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { busFilterableFields, busSearchableFields } from './bus.constant';

const createBus = async (payload: TBus, token: string) => {
  const isBusExist = await Bus.findOne({ busNumber: payload.busNumber });
  if (isBusExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bus already exist');
  }

  const user = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  if (user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  return await Bus.create({
    ...payload,
    userId: user.userId,
  });
};

const getAllBuses = async (query: Record<string, unknown>) => {
  const busQuery = new QueryBuilder(
    Bus.find({}).populate({
      path: 'userId',
      model: 'User',
    }),
    query,
  )
    .search(busSearchableFields)
    .paginate()
    .filter(busFilterableFields)
    .sort();

  const result = await busQuery.queryModel;

  const meta = await busQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleBus = async (busId: string) => {
  const isBusExist = await Bus.findById(busId);
  if (!isBusExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
  }

  return await Bus.findById(busId);
};

const updateBus = async (
  token: string,
  busId: string,
  payload: Partial<TBus>,
) => {
  const isBusExist = await Bus.findById(busId);
  if (!isBusExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
  }

  const user = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  if (user.userId !== isBusExist.userId.toString()) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  return await Bus.findByIdAndUpdate(busId, payload, { new: true });
};

const deleteBus = async (busId: string, token: string) => {
  const isBusExist = await Bus.findById(busId);
  if (!isBusExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bus not found');
  }

  const user = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  if (user.userId !== isBusExist.userId.toString()) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  return await Bus.findByIdAndUpdate(busId, { isDeleted: true }, { new: true });
};

export const BusService = {
  createBus,
  getAllBuses,
  getSingleBus,
  updateBus,
  deleteBus,
};
