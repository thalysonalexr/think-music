import { Router } from 'express';

import GenericMiddlewares from './middlewares';

import Middlewares from './app/middlewares';

import Controllers from './app/controllers';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello! you are accessing the Think Music Project API!',
    links: {
      docs: 'https://github.com/thalysonalexr/think-music#README.md'
    }
  });
});

router.post('/auth/register', Controllers.auth.register);
router.post('/auth/authenticate', Controllers.auth.auth);
router.post('/auth/forgot_password', Controllers.auth.initRecovery);
router.post('/auth/reset_password', Controllers.auth.resetPassword);

router.get('/users',
  Middlewares.auth,
  Middlewares.unprocessable,
  UserController.index
);

router.get('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  UserController.show
);

router.put('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  UserController.update
);

router.delete('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  UserController.destroy
);

router.post('/admin',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  AuthController.register
);

router.post('/admin/musics',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  MusicController.store
);

router.put('/admin/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  MusicController.update
);

router.delete('/admin/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  MusicController.destroy
);

router.post('/admin/categories',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  CategoryController.store
);

router.put('/admin/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  CategoryController.update
);

router.delete('/admin/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  CategoryController.destroy
);

router.get('/admin/logs',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  GenericMiddlewares.showLogs
);

router.post('/admin/:id/enable',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  AdminController.disableUser
);

router.get('/musics',
  Middlewares.auth,
  Middlewares.unprocessable,
  MusicController.index
);

router.get('/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  MusicController.show
);

router.get('/categories',
  Middlewares.auth,
  Middlewares.unprocessable,
  CategoryController.index
);

router.get('/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  CategoryController.show
);

router.get('/interpretations',
  Middlewares.auth,
  Middlewares.unprocessable,
  InterpretationController.index
);

router.get('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  InterpretationController.show
);

router.post('/interpretations',
  Middlewares.auth,
  Middlewares.unprocessable,
  InterpretationController.store
);

router.put('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  InterpretationController.update
);

router.delete('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  InterpretationController.destroy
);

router.post('/interpretations/:interpretation_id/comments',
  Middlewares.auth,
  Middlewares.unprocessable,
  CommentController.store,
);

router.get('/interpretations/:interpretation_id/comments',
  Middlewares.auth,
  Middlewares.unprocessable,
  CommentController.index,
);

router.get('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  CommentController.show,
);

router.put('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  CommentController.update,
);

router.delete('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  CommentController.destroy,
);

router.post('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  LikeController.store,
);

router.delete('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  LikeController.destroy,
);

router.get('/interpretations/:interpretation_id/likes/count',
  Middlewares.auth,
  Middlewares.unprocessable,
  LikeController.countLikes,
);

router.get('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  LikeController.index,
);

export default router;
