import httpStatus from 'http-status';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { decodeToken } from '../utils/decodeToken';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { TUserRole } from '../interface';
import config from '../../config';
import User from '../modules/user/user.model';
import { USER_STATUS } from '../constant';

export const auth = (...requestedRole: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    const decoded = decodeToken(
      token,
      config.jwt.access_token as Secret,
    ) as JwtPayload;

    const { role, email } = decoded;

    if (requestedRole && !requestedRole.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, 'User not found');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are deleted user');
    }

    if (
      user.status === USER_STATUS.BLOCKED ||
      user.status === USER_STATUS.DEACTIVATED
    ) {
      throw new AppError(httpStatus.CONFLICT, 'You are a blocked user');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
