import { Router } from "express";

import GenericMiddlewares from "./middlewares";
import Middlewares from "./app/middlewares";
import Controllers from "./app/controllers";
import Validators from "./app/validators";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello! you are accessing the Think Music Project API!",
    links: {
      docs: "https://github.com/thalysonalexr/think-music#README.md",
    },
  });
});

router.post(
  "/auth/register",
  Validators.auth.register(),
  Controllers.auth.register
);
router.post(
  "/auth/authenticate",
  Validators.auth.auth(),
  Controllers.auth.auth
);
router.post(
  "/auth/forgot_password",
  Validators.auth.initRecovery(),
  Controllers.auth.initRecovery
);
router.post(
  "/auth/reset_password",
  Validators.auth.reset(),
  Controllers.auth.resetPassword
);

router.get(
  "/users",
  Validators.user.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.index
);

router.get(
  "/users/:id",
  Validators.user.show(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.show
);

router.put(
  "/users/:id",
  Validators.user.update(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.update
);

router.delete(
  "/users/:id",
  Validators.user.destroy(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.user.destroy
);

router.post(
  "/admin",
  Validators.auth.register(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.auth.register
);

router.post(
  "/admin/musics",
  Validators.music.store(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.store
);

router.put(
  "/admin/musics/:id",
  Validators.music.update(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.update
);

router.delete(
  "/admin/musics/:id",
  Validators.music.destroy(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.music.destroy
);

router.post(
  "/admin/categories",
  Validators.category.store(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.store
);

router.put(
  "/admin/categories/:id",
  Validators.category.update(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.update
);

router.delete(
  "/admin/categories/:id",
  Validators.category.destroy(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.category.destroy
);

router.get(
  "/admin/logs",
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  GenericMiddlewares.showLogs
);

router.post(
  "/admin/:id/enable",
  Validators.admin.disableUser(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Middlewares.authorization,
  Controllers.admin.disableUser
);

router.get(
  "/musics",
  Validators.music.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.music.index
);

router.get(
  "/musics/:id",
  Validators.music.show(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.music.show
);

router.get(
  "/categories",
  Validators.category.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.category.index
);

router.get(
  "/categories/:id",
  Validators.category.show(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.category.show
);

router.get(
  "/interpretations",
  Validators.interp.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.index
);

router.get(
  "/interpretations/:id",
  Validators.interp.show(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.show
);

router.post(
  "/interpretations",
  Validators.interp.store(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.store
);

router.put(
  "/interpretations/:id",
  Validators.interp.update(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.update
);

router.delete(
  "/interpretations/:id",
  Validators.interp.destroy(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.interp.destroy
);

router.post(
  "/interpretations/:interpretation_id/comments",
  Validators.comment.store(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.store
);

router.get(
  "/interpretations/:interpretation_id/comments",
  Validators.comment.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.index
);

router.get(
  "/interpretations/:interpretation_id/comments/:id",
  Validators.comment.show(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.show
);

router.put(
  "/interpretations/:interpretation_id/comments/:id",
  Validators.comment.update(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.update
);

router.delete(
  "/interpretations/:interpretation_id/comments/:id",
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.comment.destroy
);

router.post(
  "/interpretations/:interpretation_id/likes",
  Validators.like.store(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.store
);

router.delete(
  "/interpretations/:interpretation_id/likes",
  Validators.like.destroy(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.destroy
);

router.get(
  "/interpretations/:interpretation_id/likes/count",
  Validators.like.countLikes(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.countLikes
);

router.get(
  "/interpretations/:interpretation_id/likes",
  Validators.like.index(),
  Middlewares.auth,
  Middlewares.unprocessable,
  Controllers.like.index
);

export default router;
