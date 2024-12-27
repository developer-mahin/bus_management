import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { TicketValidation } from './ticket.validation';
import { TicketController } from './ticket.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';

const router = Router();

router.post(
  '/admin/ticket',
  validateRequest(TicketValidation.createTicketValidationSchema),
  auth(USER_ROLE.ADMIN),
  TicketController.createTicket,
);

export const TicketRoutes = router;
