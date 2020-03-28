import { findOrCreateCategory } from './helpers';

import Music from '../models/Music';

export class MusicController {
  static async index (req, res) {
    const { page = 1, orderBy = 'id' } = req.query;

    const options = {
      page,
      paginate: 10,
      order: [[orderBy, 'ASC']],
      include: {
        association: 'category'
      },
    };

    try {
      const musics = await Music.paginate(options);

      return res.status(200).json(musics);
    } catch {
      return res.status(500).json({
        error: 500,
        password: 'Error on list musics.'
      });
    }
  }

  static async show (req, res) {
    const { id } = req.params;

    try {
      const music = await Music.findByPk(id, {
        include: {
          association: 'category'
        }
      });

      if (!music) {
        return res.status(404).json({
          error: 404,
          message: 'Not found music.'
        });
      }

      return res.status(200).json({ music });
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on show music.'
      });
    }
  }

  static async store (req, res) {
    const {
      link,
      title,
      author,
      letter,
      category,
      description,
    } = req.body;

    try {
      const model = await findOrCreateCategory(category);

      const music = await Music.create({
        link,
        title,
        letter,
        author,
        description,
        category_id: model.id
      });

      return res.status(201).json({ music });
    } catch {
      return res.status(500).json({
        err: 500,
        message: 'Error on create music.'
      });
    }
  }

  static async update (req, res) {
    const { id } = req.params;
    const {
      link,
      title,
      letter,
      author,
      category,
      description,
    } = req.body;

    try {
      const music = await Music.findByPk(id);

      if (!music) {
        return res.status(404).json({
          error: 404,
          message: 'Music not found.'
        });
      }

      const model = findOrCreateCategory(category);

      music.link = link;
      music.title = title;
      music.letter = letter;
      music.author = author;
      music.description = description;
      music.category_id = model.id;

      await music.save();

      return res.status(200).json({ music });
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on update music.'
      });
    }
  }

  static async destroy (req, res) {
    const { id } = req.params;

    try {
      const music = await Music.destroy({
        where: { id }
      });

      if (music)
        return res.status(204).end();

      return res.status(404).json({
        error: 404,
        message: 'Music not found'
      });
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on destroy music.'
      });
    }
  }
}
