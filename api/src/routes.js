import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import authorizationMiddleware from './app/middlewares/authorization';
import unprocessableMiddleware from './app/middlewares/unprocessable';
import UsersController from './app/controllers/UsersController';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello! you are accessing the Think Music Project API!',
    links: {
      docs: 'https://github.com/thalysonalexr/think-music#README.md'
    }
  });
});

router.post('/auth/register', UsersController.store);
router.post('/auth/authenticate', UsersController.auth);
router.post('/auth/forgot_password', UsersController.forgotPassword);
router.post('/auth/reset_password', UsersController.resetPassword);

router.get('/users',
  authMiddleware,
  unprocessableMiddleware,
  UsersController.index
);

router.get('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UsersController.show
);

router.put('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UsersController.update
);

router.delete('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UsersController.destroy
);

router.post('/users/admin',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  UsersController.store
);

router.post('/users/:id/enable',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  UsersController.disableUser
);

export default router;
