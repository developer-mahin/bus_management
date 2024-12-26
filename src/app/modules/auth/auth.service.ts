import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { hashPassword } from '../../utils/hashPassword';
import config from '../../../config';
import { isMatchedPassword } from '../../utils/matchPassword';
import { USER_STATUS } from '../../constant';
import generateToken from '../../utils/generateToken';
import { Secret } from 'jsonwebtoken';

const registerUser = async (
  payload: Omit<IUser, 'role' | 'status' | 'isDeleted'>,
) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User already exist');
  }

  const passwordHash = await hashPassword(payload.password, 10);

  await User.create({
    name: payload.name,
    email: payload.email,
    password: passwordHash,
    contactNo: payload.contactNo,
    profileImage: payload.profileImage,
  });
};

const loginUser = async (payload: Pick<IUser, 'email' | 'password'>) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const checkUserStatus = user?.status;
  if (
    checkUserStatus === USER_STATUS.BLOCKED ||
    checkUserStatus === USER_STATUS.DEACTIVATED
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const matchPassword = await isMatchedPassword(password, user?.password);

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  const userData = {
    email: user?.email,
    userId: user?._id,
    role: user?.role,
  };

  const accessToken = generateToken(
    userData,
    config.jwt.access_token as Secret,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = generateToken(
    userData,
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logOutUser = async () => {
  return {};
};

export const AuthService = {
  registerUser,
  loginUser,
  logOutUser,
};
