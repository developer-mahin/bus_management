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

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidation),
  AuthController.loginUser,
);

router.post('/logout', AuthController.logOutUser);

export const AuthRoutes = router;
