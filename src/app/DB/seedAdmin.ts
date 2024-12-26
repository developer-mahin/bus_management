import config from '../../config';
import { USER_ROLE } from '../constant';
import User from '../modules/user/user.model';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  try {
    const isExistAdmin = await User.findOne({
      role: USER_ROLE.ADMIN,
    });

    if (isExistAdmin) {
      console.log('Admin is already exist!!');
      return;
    }

    const hashPassword = await bcrypt.hash(config.admin.password!, 10);

    await User.create({
      name: config.admin.name,
      email: config.admin.email,
      password: hashPassword,
      role: USER_ROLE.ADMIN,
      contactNo: config.admin.contactNo,
      profileImage: config.admin.profileImage,
    });

    console.log('Admin created successfully!');
  } catch (error) {
    console.error(error);
  }
};
