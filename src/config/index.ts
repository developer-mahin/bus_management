import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_round: process.env.SALT_ROUND,
  jwt: {
    access_token: process.env.ACCESS_KEY,
    access_expires_in: process.env.ACCESS_EXPIRE_IN,
    refresh_token: process.env.REFRESH_KEY,
    refresh_expires_in: process.env.REFRESH_EXPIRE_IN,
  },
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASS,
  server_url: process.env.SERVER_URL,
  front_end_url: process.env.FRONT_END_URL,
};
