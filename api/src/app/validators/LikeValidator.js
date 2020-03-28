import { celebrate, Segments, Joi } from 'celebrate';

export class LikeValidator {
  static index() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static store() {
    return celebrate({
      [Segments.QUERY]: Joi.object().keys({
        action: Joi.string().valid('like', 'dislike').required()
      }),

      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static destroy() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }

  static countLikes() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        interpretation_id: Joi.string().uuid().required(),
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown()
    });
  }
}