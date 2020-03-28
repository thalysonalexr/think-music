import { celebrate, Segments, Joi } from 'celebrate';

export class AdminValidator {
  static disableUser() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
      }),

      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().max(280).required(),
      }).unknown(),

      [Segments.QUERY]: Joi.object().keys({
        status: Joi.boolean().required()
      })
    });
  }
}
