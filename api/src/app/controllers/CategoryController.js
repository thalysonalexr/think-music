import Category from "../models/Category";
import Music from "../models/Music";

export class CategoryController {
  static async index(req, res) {
    const { page = 1, orderBy = "id" } = req.query;

    const options = {
      page,
      paginate: 10,
      order: [[orderBy, "ASC"]],
    };

    const categories = await Category.paginate(options);

    return res.status(200).json(categories);
  }

  static async show(req, res) {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        error: 404,
        message: "Not found category.",
      });
    }

    return res.status(200).json({ category });
  }

  static async store(req, res) {
    const { title, description } = req.body;

    if (await Category.findOne({ where: { title } })) {
      return res.status(409).json({
        error: 409,
        message: "Category already exists to title.",
      });
    }

    const category = await Category.create({
      title,
      description,
    });

    return res.status(201).json({ category });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        error: 404,
        message: "Category not found.",
      });
    }

    if (await Category.findOne({ where: { title } })) {
      return res.status(409).json({
        error: 409,
        message: "Category already exists to title.",
      });
    }

    category.title = title;
    category.description = description;

    await category.save();

    return res.status(200).json({ category });
  }

  static async destroy(req, res) {
    const { id } = req.params;

    if (await Music.findOne({ where: { category_id: id } })) {
      return res.status(409).json({
        error: 409,
        message: "The category is linked to at least one music.",
      });
    }

    const category = await Category.destroy({
      where: { id },
    });

    if (category) return res.status(204).end();

    return res.status(404).json({
      error: 404,
      message: "Category not found",
    });
  }
}
