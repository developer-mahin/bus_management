import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { busValidationSchema } from './bus.validation';
import { BusController } from './bus.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';

const router = Router();

router.post(
  '/admin/bus',
  validateRequest(busValidationSchema.createBusValidationSchema),
  auth(USER_ROLE.ADMIN),
  BusController.createBus,
);

router.get('/buses', BusController.getAllBuses);

router.get('/admin/bus/:id', BusController.getSingleBus);

router.put(
  '/admin/bus/:id',
  validateRequest(busValidationSchema.updateBusValidationSchema),
  auth(USER_ROLE.ADMIN),
  BusController.updateBus,
);

router.delete('/admin/bus/:id', auth(USER_ROLE.ADMIN), BusController.deleteBus);

export const BusRoutes = router;
