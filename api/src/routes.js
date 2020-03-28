import { Router } from 'express';

import { logs } from './middlewares/accesslog';
import authMiddleware from './app/middlewares/auth';
import authorizationMiddleware from './app/middlewares/authorization';
import unprocessableMiddleware from './app/middlewares/unprocessable';

import AdminController from './app/controllers/AdminController';
import AuthController from './app/controllers/AuthController';
import CategoryController from './app/controllers/CategoryController';
import CommentController from './app/controllers/CommentController';
import InterpretationController from './app/controllers/InterpretationController';
import LikeController from './app/controllers/LikeController';
import MusicController from './app/controllers/MusicController';
import UserController from './app/controllers/UserController';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello! you are accessing the Think Music Project API!',
    links: {
      docs: 'https://github.com/thalysonalexr/think-music#README.md'
    }
  });
});

router.post('/auth/register', AuthController.register);
router.post('/auth/authenticate', AuthController.auth);
router.post('/auth/forgot_password', AuthController.initRecovery);
router.post('/auth/reset_password', AuthController.resetPassword);

router.get('/users',
  authMiddleware,
  unprocessableMiddleware,
  UserController.index
);

router.get('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UserController.show
);

router.put('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UserController.update
);

router.delete('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  UserController.destroy
);

router.post('/admin',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  AuthController.register
);

router.post('/admin/musics',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  MusicController.store
);

router.put('/admin/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  MusicController.update
);

router.delete('/admin/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  MusicController.destroy
);

router.post('/admin/categories',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  CategoryController.store
);

router.put('/admin/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  CategoryController.update
);

router.delete('/admin/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  CategoryController.destroy
);

router.get('/admin/logs',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  logs
);

router.post('/admin/:id/enable',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  AdminController.disableUser
);

router.get('/musics',
  authMiddleware,
  unprocessableMiddleware,
  MusicController.index
);

router.get('/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  MusicController.show
);

router.get('/categories',
  authMiddleware,
  unprocessableMiddleware,
  CategoryController.index
);

router.get('/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  CategoryController.show
);

router.get('/interpretations',
  authMiddleware,
  unprocessableMiddleware,
  InterpretationController.index
);

router.get('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  InterpretationController.show
);

router.post('/interpretations',
  authMiddleware,
  unprocessableMiddleware,
  InterpretationController.store
);

router.put('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  InterpretationController.update
);

router.delete('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  InterpretationController.destroy
);

router.post('/interpretations/:interpretation_id/comments',
  authMiddleware,
  unprocessableMiddleware,
  CommentController.store,
);

router.get('/interpretations/:interpretation_id/comments',
  authMiddleware,
  unprocessableMiddleware,
  CommentController.index,
);

router.get('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  CommentController.show,
);

router.put('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  CommentController.update,
);

router.delete('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  CommentController.destroy,
);

router.post('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  LikeController.store,
);

router.delete('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  LikeController.destroy,
);

router.get('/interpretations/:interpretation_id/likes/count',
  authMiddleware,
  unprocessableMiddleware,
  LikeController.countLikes,
);

router.get('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  LikeController.index,
);

export default router;
