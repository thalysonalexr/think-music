import { celebrate, Segments, Joi } from 'celebrate';

export class MusicValidator {
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
        link: Joi.string().max(255).required(),
        title: Joi.string().max(100).required(),
        description: Joi.string().max(280).required(),
        letter: Joi.string().max(10000),
        author: Joi.string().max(255),
        category: Joi.object().required().keys({
          title: Joi.string().max(45).required(),
          description: Joi.string().max(255),
        })
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
        link: Joi.string().max(255).required(),
        title: Joi.string().max(100).required(),
        description: Joi.string().max(280).required(),
        letter: Joi.string().max(10000),
        author: Joi.string().max(255),
        category: Joi.object().required().keys({
          title: Joi.string().max(45).required(),
          description: Joi.string().max(255),
        })
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