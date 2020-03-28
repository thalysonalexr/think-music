import Category from "../models/Category";

export class CategoryController {
  static async index (req, res) {
    const { page = 1, orderBy = 'id' } = req.query;

    const options = {
      page,
      paginate: 10,
      order: [[orderBy, 'ASC']],
    };

    try {
      const categories = await Category.paginate(options);

      return res.status(200).json(categories);
    } catch {
      return res.status(500).json({
        error: 500,
        password: 'Error on list categories.'
      });
    }
  }

  static async show (req, res) {
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
    } catch {
      return res.status(500).json({
        error: 500,
        message: 'Error on show category'
      });
    }
  }

  static async store (req, res) {
    const { title, description } = req.body;

    try {
      const category = await Category.create({
        title,
        description
      });

      return res.status(201).json({ category });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 409,
          message: 'Category already exists to title.'
        });
      }

      return res.status(500).json({
        error: 500,
        message: 'Error on create category.'
      });
    }
  }

  static async update (req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          error: 404,
          message: 'Category not found.'
        });
      }

      category.title = title;
      category.description = description;

      await category.save();

      return res.status(200).json({ category });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 409,
          message: 'Category already exists to title.'
        });
      }

      return res.status(500).json({
        error: 500,
        message: 'Error on update category.'
      });
    }
  }

  static async destroy (req, res) {
    const { id } = req.params;

    try {
      const category = await Category.destroy({
        where: { id }
      });

      if (category)
        return res.status(204).end();

      return res.status(404).json({
        error: 404,
        message: 'Category not found'
      });
    } catch (err) {
      if (err.parent.code === 23502) {
        return res.status(409).json({
          error: 409,
          message: 'The category is linked to at least one music.'
        });
      }

      return res.status(500).json({
        error: 500,
        message: 'Error on destroy category.'
      });
    }
  }
}
