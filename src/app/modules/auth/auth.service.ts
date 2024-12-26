import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { hashPassword } from '../../utils/hashPassword';
import config from '../../../config';

const registerUser = async (
  payload: Pick<IUser, 'name' | 'email' | 'password'>,
) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User already exist');
  }

  const passwordHash = await hashPassword(
    payload.password,
    Number(config.salt_round),
  );

  await User.create({
    name: payload.name,
    email: payload.email,
    password: passwordHash,
  });
};

export const AuthService = {
  registerUser,
};
