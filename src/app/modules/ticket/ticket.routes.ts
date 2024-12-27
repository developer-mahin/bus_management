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

router.post(
  '/tickets/purchase',
  validateRequest(TicketValidation.ticketPurchaseValidationSchema),
  auth(USER_ROLE.USER),
  TicketController.purchaseTicket,
);

router.get('/tickets', auth(USER_ROLE.USER), TicketController.getAllTickets);

router.put(
  '/admin/ticket/:id',
  auth(USER_ROLE.ADMIN),
  TicketController.updateTicket,
);

router.delete(
  '/admin/ticket/:id',
  auth(USER_ROLE.ADMIN),
  TicketController.deleteTicket,
);

export const TicketRoutes = router;
