import { Op } from 'sequelize';

import Music from '../models/Music';
import Category from '../models/Category';

export default {
  async index(req, res) {
    const { page = 1, orderBy = 'id' } = req.query;
    
    const options = {
      page,
      order: [[orderBy, 'ASC']],
      paginate: 10,
    };

    try {
      const musics = await Music.paginate(options);

      return res.status(200).json(musics);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        password: 'Error on list musics.'
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const music = await Music.findByPk(id);

      if (!music) {
        return res.status(404).json({
          error: 404,
          message: 'Not found music.'
        });
      }

      return res.status(200).json({ music });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on show music.'
      });
    }
  },

  async store(req, res) {
    const { link, title, author, description, letter, category } = req.body;

    if (link === undefined ||
       title === undefined ||
       author === undefined ||
       category === undefined) {
      return res.status(400).json({
        error: 400,
        message: 'Bad Request.'
      });
    }

    try {
      const [ cat ] = await Category.findOrCreate({ where: {
        title: {
          [Op.iLike]: `%${category}%`
        }
      },
      defaults: {
        title: category,
        description: '',
      }
     });

      const music = await Music.create({
        link,
        title,
        description,
        letter,
        author,
        category_id: cat.id
      });

      return res.status(201).json({ music });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err: 500,
        message: 'Error on create music.'
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { link, title, description, letter, author, category } = req.body;

    try {
      if (link === undefined ||
        title === undefined ||
        author === undefined ||
        category === undefined) {
        return res.status(400).json({
          error: 400,
          message: 'Bad Request.'
        });
      }

      const music = await Music.findByPk(id);

      if (!music) {
        return res.status(404).json({
          error: 404,
          message: 'Music not found.'
        });
      }

      music.link = link;
      music.title = title;
      music.description = description;
      music.letter = letter;
      music.author = author;

      const [ cat ] = await Category.findOrCreate({ where: {
        title: {
            [Op.iLike]: `%${category}%`
          }
        },
        defaults: {
          title: category,
          description: '',
        }
      });

      music.category_id = cat.id;

      await music.save();

      return res.status(200).json({ music });
    } catch (err) {
      console.log(err.message)
      return res.status(500).json({
        error: 500,
        message: 'Error on update music.'
      });
    }
  }
}
