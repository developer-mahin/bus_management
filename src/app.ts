/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
import notFound from './app/middleware/nof-found';
import globalErrorHandler from './app/middleware/globalErrorHandler';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

// Routes Middleware
app.use(router);

// Default Route
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'Welcome To The ticket Management System',
  });
});

// Not Found Middleware
app.use(notFound);

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
