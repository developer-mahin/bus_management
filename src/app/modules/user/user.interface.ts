type TRole = 'ADMIN' | 'USER';
type TStatus = 'ACTIVE' | 'DEACTIVATED' | 'BLOCKED';

export type IUser = {
  name: string;
  email: string;
  password: string;
  contactNo?: string;
  profileImage?: string;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
};
