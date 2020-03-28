import { Router } from 'express';

import { logs } from './middlewares/accesslog';
import authMiddleware from './app/middlewares/auth';
import authorizationMiddleware from './app/middlewares/authorization';
import unprocessableMiddleware from './app/middlewares/unprocessable';

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
);

export default router;
