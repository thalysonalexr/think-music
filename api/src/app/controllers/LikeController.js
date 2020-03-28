import Like from '../models/Like';

export class LikeController {
  static async index (req, res) {
    const { page = 1 } = req.query;
    const { interpretation_id } = req.params;
  
    const options = {
      page,
      paginate: 25,
      order: [['created_at', 'ASC']],
      attributes: ['like', 'dislike', 'createdAt', 'updatedAt'],
      include: {
        association: 'user',
        attributes: ['id', 'name']
      },
      where: {
        interpretation_id
      }
    };
  
    try {
      const likes = await Like.paginate(options);
  
      return res.status(200).json(likes);
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on list likes by interpretations.'
      });
    }
  }

  static async store (req, res) {
    const { userId } = req;
    const { action } = req.query;
    const { interpretation_id } = req.params;

    let like, dislike;

    try {
      if (action === 'like') {
        like = true; dislike = false;
      } else {
        like = false; dislike = true;
      }

      const model = await Like.create({
        like,
        dislike,
        interpretation_id,
        user_id: userId,
      });

      return res.status(201).json({ 'like': model });
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
  }

  static async destroy (req, res) {
    const { userId } = req;
    const { interpretation_id } = req.params;

    try {
      const like = await Like.destroy({
        where: {
          interpretation_id,
          user_id: userId
        }
      });

      if (like)
        return res.status(204).end();

      return res.status(404).json({
        error: 404,
        message: 'Like not found'
      });
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on destroy like.'
      });
    }
  }

  static async countLikes (req, res) {
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
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on count likes.'
      });
    }
  }
}
