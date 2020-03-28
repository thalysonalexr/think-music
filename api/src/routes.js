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
<<<<<<< HEAD
  authMiddleware,
  unprocessableMiddleware,
  Controllers.user.index
);

router.get('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.user.show
);

router.put('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.user.update
);

router.delete('/users/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.user.destroy
);

router.post('/admin',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.auth.register
);

router.post('/admin/musics',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.music.store
);

router.put('/admin/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.music.update
);

router.delete('/admin/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.music.destroy
);

router.post('/admin/categories',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.category.store
);

router.put('/admin/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.category.update
);

router.delete('/admin/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.category.destroy
=======
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
>>>>>>> master
);

router.get('/admin/logs',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  GenericMiddlewares.showLogs
);

router.post('/admin/:id/enable',
<<<<<<< HEAD
  authMiddleware,
  unprocessableMiddleware,
  authorizationMiddleware,
  Controllers.admin.disableUser
);

router.get('/musics',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.music.index
);

router.get('/musics/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.music.show
);

router.get('/categories',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.category.index
);

router.get('/categories/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.category.show
);

router.get('/interpretations',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.interp.index
);

router.get('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.interp.show
);

router.post('/interpretations',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.interp.store
);

router.put('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.interp.update
);

router.delete('/interpretations/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.interp.destroy
);

router.post('/interpretations/:interpretation_id/comments',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.comment.store,
);

router.get('/interpretations/:interpretation_id/comments',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.comment.index,
);

router.get('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.comment.show,
);

router.put('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.comment.update,
);

router.delete('/interpretations/:interpretation_id/comments/:id',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.comment.destroy,
);

router.post('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.like.store,
);

router.delete('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.like.destroy,
);

router.get('/interpretations/:interpretation_id/likes/count',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.like.countLikes,
);

router.get('/interpretations/:interpretation_id/likes',
  authMiddleware,
  unprocessableMiddleware,
  Controllers.like.index,
=======
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
>>>>>>> master
);

export default router;
