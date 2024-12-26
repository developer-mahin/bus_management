import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { busValidationSchema } from './bus.validation';

const router = Router();



router.post("/admin/bus", validateRequest(busValidationSchema.createBusValidationSchema))


export const BusRoutes = router;
