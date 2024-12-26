import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
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
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
