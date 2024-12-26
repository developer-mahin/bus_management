/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './config';

// eslint-disable-next-line no-unused-vars
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string).then(() => {
      console.log('Database connected successfully');
    });

    server = app.listen(config.port, () => {
      console.log(
        `Server is running successfully http://localhost:${config.port}/`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`👹 unhandledRejection is detected, shuting down....`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`👹 uncaughtException is detected, shuting down....`);
  process.exit(1);
});
