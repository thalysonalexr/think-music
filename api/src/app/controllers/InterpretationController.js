import Interpretation from "../models/Interpretation";

import { isAdmin } from "./helpers";

export class InterpretationController {
  static async index(req, res) {
    const { page = 1, orderBy = "id" } = req.query;

    const options = {
      page,
      paginate: 10,
      order: [[orderBy, "ASC"]],
      attributes: ["id", "interpretation", "createdAt", "updatedAt"],
      include: [
        {
          association: "author",
          attributes: ["id", "name"],
        },
        {
          association: "music",
          attributes: ["id", "link", "title", "author"],
          include: { association: "category" },
        },
      ],
    };

    const interpretations = await Interpretation.paginate(options);

    return res.status(200).json(interpretations);
  }

  static async store(req, res) {
    const { userId } = req;
    const { interpretation, music } = req.body;

    const model = await Interpretation.create({
      interpretation,
      music_id: music,
      author_id: userId,
    });

    return res.status(201).json({
      interpretation: model,
    });
  }

  static async show(req, res) {
    const { id } = req.params;

    const interpretation = await Interpretation.findByPk(id, {
      include: [
        {
          association: "music",
          include: {
            association: "category",
          },
        },
      ],
    });

    if (!interpretation) {
      return res.status(404).json({
        error: 404,
        message: "Interpretation not found.",
      });
    }

    return res.status(200).json({ interpretation });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { userId } = req;
    const { interpretation, music } = req.body;

    const model = await Interpretation.findByPk(id);

    if (!model) {
      return res.status(404).json({
        error: 404,
        message: "Not found interpretation.",
      });
    }

    if (model.author_id !== userId || !isAdmin(userId)) {
      return res.status(403).json({
        error: 403,
        message: "You not have access this resource.",
      });
    }

    model.music_id = music;
    model.interpretation = interpretation;
    await model.save();

    return res.status(200).json({
      interpretation: model,
    });
  }

  static async destroy(req, res) {
    const { id } = req.params;
    const { userId } = req;

    const interpretation = await Interpretation.findByPk(id);

    if (!interpretation) {
      return res.status(404).json({
        error: 404,
        message: "Interpretation not found.",
      });
    }

    if (interpretation.author_id !== userId || !isAdmin(userId)) {
      return res.status(403).json({
        error: 403,
        message: "You not have access this resource.",
      });
    }

    await Interpretation.destroy({
      where: { id },
    });

    return res.status(204).end();
  }
}
