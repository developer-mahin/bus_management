import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BusRoutes } from '../modules/bus/bus.routes';
const router = Router();

const routes = [
  {
    path: '/',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:"/", 
    route: BusRoutes
  }
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
