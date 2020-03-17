import Interpretation from '../models/Interpretation';
import { isAdmin } from '../helpers';

export default {
  async index (req, res) {
    const { page = 1, orderBy = 'id' } = req.query;

    const options = {
      page,
      order: [[orderBy, 'ASC']],
      paginate: 10,
      attributes: [
        'id',
        'interpretation',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          association: 'author',
          attributes: ['id', 'name']
        },
        {
          association: 'music',
          attributes: ['id', 'link', 'title', 'author'],
          include: { association: 'category' }
        }
      ]
    };

    try {
      const interpretations = await Interpretation.paginate(options);

      return res.status(200).json(interpretations)
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on list interpretations.'
      });
    }
  },

  async store (req, res) {
    const { interpretation, music } = req.body;

    if (!interpretation) {
      return res.status(400).json({
        error: 400,
        message: 'Bad Request.'
      });
    }

    try {
      const interpretationModel = await Interpretation.create({
        interpretation,
        music_id: music,
        author_id: req.userId,
      });

      return res.status(201).json({ 'interpretation': interpretationModel });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on create interpretation.'
      });
    }
  },

  async show (req, res) {
    const { id } = req.params;

    try {
      const interpretation = await Interpretation.findByPk(id, {
        include: [
          { association: 'music', include: {
            association: 'category'
          } }
        ]
      });

      if (!interpretation) {
        return res.status(404).json({
          error: 404,
          message: 'Interpretation not found.'
        });
      }

      return res.status(200).json({ interpretation });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on show interpretation.'
      });
    }
  },

  async update (req, res) {
    const { id } = req.params;
    const { interpretation, music } = req.body;

    try {
      const interpretationModel = await Interpretation.findByPk(id);

      if (!interpretationModel) {
        return res.status(404).json({
          error: 404,
          message: 'Not found interpretation.'
        });
      }

      if (interpretationModel.author_id !== req.userId && !isAdmin(req.userId)) {
        return res.status(403).json({
          error: 403,
          message: 'You not have access this resource.'
        });
      }

      interpretationModel.music_id = music;
      interpretationModel.interpretation = interpretation;
      
      await interpretationModel.save();

      return res.status(200).json({ interpretationModel });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on update interpretation.'
      });
    }
  },

  async destroy (req, res) {
    const { id } = req.params;

    try {
      const interpretation = await Interpretation.findByPk(id);

      if (!interpretation) {
        return res.status(404).json({
          error: 404,
          message: 'Interpretation not found.'
        });
      }

      if (interpretation.author_id !== req.userId && !isAdmin(req.userId)) {
        return res.status(403).json({
          error: 403,
          message: 'You not have access this resource.'
        });
      }

      await Interpretation.destroy({ where: { id } });

      return res.status(204).end();
    } catch (err) {
      return res.status().json({
        error: 500,
        message: 'Error on destroy interpretation.'
      });
    }
  }
}