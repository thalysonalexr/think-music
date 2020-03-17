import Like from '../models/Like';

export default {
  async store (req, res) {
    const { action } = req.query;
    const { interpretation_id } = req.params;

    let like, dislike;
    
    try {
      switch (action) {
        case 'like':
          like = true; dislike = false;
          break;
        case 'dislike':
          like = false; dislike = true;
          break;
        default:
          return res.status(400).json({
            error: 400,
            message: 'Bad Request'
          });
      }

      const likeModel = await Like.create({
        like,
        dislike,
        interpretation_id,
        user_id: req.userId,
      });
      
      return res.status(201).json({ 'like': likeModel });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 409,
          message: 'Like already exists to interpretation.'
        });
      }
      
      return res.status(500).json({
        error: 500,
        message: 'Error on create like.'
      });
    }
  },

  async destroy (req, res) {    
    const { interpretation_id } = req.params;

    try {
      const like = await Like.destroy({
        where: { interpretation_id, user_id: req.userId }
      });

      if (like)
        return res.status(204).end();

      return res.status(404).json({
        error: 404,
        message: 'Like not found'
      });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on destroy like.'
      });
    }
  },

  async countLikes (req, res) {
    const { interpretation_id } = req.params;

    try {
      const likes = await Like.count({
        where: {
          interpretation_id,
          like: true,
        },
      });

      const dislikes = await Like.count({
        where: {
          interpretation_id,
          dislike: true,
        },
      });

      return res.status(200).json({ likes, dislikes });
    } catch (err) {
      console.log(err.message)
      return res.status(500).json({
        error: 500,
        message: 'Error on count likes.'
      });
    }
  },

  async index (req, res) {
    const { interpretation_id } = req.params;
    const { page = 1 } = req.query;

    const options = {
      page,
      order: [['created_at', 'ASC']],
      paginate: 25,
      where: { interpretation_id },
      attributes: ['like', 'dislike', 'createdAt', 'updatedAt'],
      include: { association: 'user', attributes: ['id', 'name'] }
    };

    try {
      const likes = await Like.paginate(options);

      return res.status(200).json(likes);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on list likes by interpretations.'
      });
    }
  },
}
