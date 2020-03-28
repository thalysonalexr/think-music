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
  Controllers.user.index
);

router.get('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.show
);

router.put('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.update
);

router.delete('/users/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.destroy
);

router.post('/admin',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.auth.register
);

router.post('/admin/musics',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.store
);

router.put('/admin/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.update
);

router.delete('/admin/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.destroy
);

router.post('/admin/categories',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.store
);

router.put('/admin/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.update
);

router.delete('/admin/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.destroy
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
  Controllers.admin.disableUser
);

router.get('/musics',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.music.index
);

router.get('/musics/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.music.show
);

router.get('/categories',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.category.index
);

router.get('/categories/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.category.show
);

router.get('/interpretations',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.index
);

router.get('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.show
);

router.post('/interpretations',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.store
);

router.put('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.update
);

router.delete('/interpretations/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.destroy
);

router.post('/interpretations/:interpretation_id/comments',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.store,
);

router.get('/interpretations/:interpretation_id/comments',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.index,
);

router.get('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.show,
);

router.put('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.update,
);

router.delete('/interpretations/:interpretation_id/comments/:id',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.destroy,
);

router.post('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.store,
);

router.delete('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.destroy,
);

router.get('/interpretations/:interpretation_id/likes/count',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.countLikes,
);

router.get('/interpretations/:interpretation_id/likes',
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.index,
);

export default router;
