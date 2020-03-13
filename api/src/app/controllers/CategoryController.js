import Category from "../models/Category";

export default {
  async index(req, res) {
    const { page = 1, orderBy = 'id' } = req.query;

    const options = {
      page,
      order: [[orderBy, 'ASC']],
      paginate: 10,
    };

    try {
      const categories = await Category.paginate(options);

      return res.status(200).json(categories);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        password: 'Error on list categories.'
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          error: 404,
          message: 'Not found category.'
        });
      }

      return res.status(200).json({ category });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on show category'
      });
    }
  },

  async store(req, res) {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        error: 400,
        message: 'Bad Request.'
      });
    }

    try {
      const category = await Category.create({ title, description });

      return res.status(201).json({ category });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on create category.'
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const category = await Category.findByPk(id);

      if (title)
        category.title = title;
      
      if (description)
        category.description = description;

      await category.save();

      return res.status(200).json(category);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on update category.'
      });
    }
  }
}