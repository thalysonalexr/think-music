import { celebrate, Segments, Joi } from 'celebrate';

export class AuthValidator {
  static auth() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(255).email().required(),
        password: Joi.string().max(255).required()
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required()
      }).unknown()
    });
  }

  static register() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().max(255).email().required(),
        password: Joi.string().min(5).max(12).required()
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required()
      }).unknown()
    });
  }

  static initRecovery() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(255).email().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required()
      }).unknown()
    });
  }

  static reset() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(255).email().required(),
        token: Joi.string().max(255).required(),
        password: Joi.string().min(5).max(12).required()
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required()
      }).unknown()
    });
  }
}
