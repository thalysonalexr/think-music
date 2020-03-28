import { celebrate, Segments, Joi } from 'celebrate';

export class CommentValidator {
  static index() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required()
      }),

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
        interpretation_id: Joi.string().uuid().required(),
        id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static store() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required(),
      }),

      [Segments.BODY]: Joi.object().keys({
        comment: Joi.string().max(280).required()
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
        interpretation_id: Joi.string().uuid().required(),
        id: Joi.string().uuid().required(),
      }),

      [Segments.BODY]: Joi.object().keys({
        comment: Joi.string().max(280).required()
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
        interpretation_id: Joi.string().uuid().required(),
        id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }
}