import { celebrate, Segments, Joi } from 'celebrate';

export class CategoryValidator {
  static index() {
    return celebrate({
      [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
        orderBy: Joi.string()
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static show() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static store() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(3).max(45).required(),
        description: Joi.string().min(3).max(255).required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
        'content-type': Joi.equal('application/json').required()
      }).unknown()
    });
  }

  static update() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(3).max(45).required(),
        description: Joi.string().min(3).max(255).required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
        'content-type': Joi.equal('application/json').required()
      }).unknown(),

      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
    });
  }

  static destroy() {
    return celebrate({
      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required()
      }).unknown(),

      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),
    });
  }
}