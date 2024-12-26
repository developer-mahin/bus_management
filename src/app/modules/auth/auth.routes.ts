import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registration),
  AuthController.registerUser,
);

export const AuthRoutes = router;
