/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { seedAdmin } from './app/DB/seedAdmin';

// eslint-disable-next-line no-unused-vars
let server: Server;

// Connect to database and start the server
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
// Seed Admin in database if not exist
seedAdmin();

// Handle unhandled promise rejection
process.on('unhandledRejection', () => {
  console.log(`👹 unhandledRejection is detected, shuting down....`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Handle uncaught exception
process.on('uncaughtException', () => {
  console.log(`👹 uncaughtException is detected, shuting down....`);
  process.exit(1);
});
