import { celebrate, Segments, Joi } from 'celebrate';

export class InterpretationValidator {
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
        id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static store() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        interpretation: Joi.string().min(45).max(5000).required(),
        music: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required(),
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static update() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required(),
      }),

      [Segments.BODY]: Joi.object().keys({
        interpretation: Joi.string().min(45).max(5000).required(),
        music: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        'content-type': Joi.equal('application/json').required(),
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static destroy() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }
}