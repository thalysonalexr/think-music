import Comment from '../models/Comment';

export default {
  async index (req, res) {
    const { interpretation_id } = req.params;
    const { page = 1, orderBy = 'id' } = req.query;

    const options = {
      page,
      order: [[orderBy, 'ASC']],
      paginate: 10,
      include: { association: 'user', attributes: ['id', 'name'] },
      attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
      where: { interpretation_id }
    }

    try {
      const comments = await Comment.paginate(options);

      return res.status(200).json(comments);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on list comments.'
      });
    }
  },

  async show (req, res) {
    const { interpretation_id, id } = req.params;

    try {
      const comment = await Comment.findOne({
        where: {
          id,
          interpretation_id,
          user_id: req.userId
        }
      });

      if (!comment) {
        return res.status(404).json({
          error: 404,
          message: 'Not found comment.'
        });
      }

      return res.status(200).json({ comment });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on show comment.'
      })
    }
  },

  async store (req, res) {
    const { comment } = req.body;
    const { interpretation_id } = req.params;
    
    try {
      const commentModel = await Comment.create({
        comment,
        interpretation_id,
        user_id: req.userId,
      });

      return res.status(201).json({ 'comment': commentModel });
    } catch (err) {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          error: 409,
          message: 'Interpretation not found to id.'
        });
      }
      
      return res.status(500).json({
        error: 500,
        message: 'Error on create comment.'
      })
    }
  },

  async update (req, res) {
    const { interpretation_id, id } = req.params;
    const { comment } = req.body;

    try {
      const commentModel = await Comment.findOne({ where: { id, interpretation_id } });

      if (!commentModel) {
        return res.status(404).json({
          error: 404,
          message: 'Not found comment'
        });
      }

      commentModel.comment = comment;

      await commentModel.save();

      return res.status(200).json({ 'comment': commentModel });
    } catch (err) {
      return res.status().json({
        error: 500,
        message: 'Error on update comment.'
      });
    }
  },

  async destroy (req, res) {
    const { interpretation_id, id } = req.params;

    try {
      const comment = await Comment.findOne({
        where: { id, interpretation_id }
      });

      if (!comment) {
        return res.status(404).json({
          error: 404,
          message: 'Not found comment.'
        });
      }

      if (comment.user_id !== req.userId) {
        return res.status(403).json({
          error: 403,
          message: 'You not have access this resource.'
        });
      }

      await Comment.destroy({ where: { id } });

      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on destroy comment.'
      });
    }
  }
}
