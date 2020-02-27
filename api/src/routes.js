import express from 'express';
import authMiddleware from './app/middlewares/auth';
import UsersController from './app/controllers/UsersController';

const router = express.Router();

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

export default router;
