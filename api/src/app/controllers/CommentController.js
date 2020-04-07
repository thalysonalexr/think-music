import Comment from "../models/Comment";
import Interpretation from "../models/Interpretation";

export class CommentController {
  static async index(req, res) {
    const { interpretation_id } = req.params;
    const { page = 1, orderBy = "id" } = req.query;

    const options = {
      page,
      paginate: 10,
      include: {
        association: "user",
        attributes: ["id", "name"],
      },
      order: [[orderBy, "ASC"]],
      attributes: ["id", "comment", "createdAt", "updatedAt"],
      where: {
        interpretation_id,
      },
    };

    const comments = await Comment.paginate(options);

    return res.status(200).json(comments);
  }

  static async show(req, res) {
    const { userId } = req;
    const { id, interpretation_id } = req.params;

    const comment = await Comment.findOne({
      where: {
        id,
        interpretation_id,
        user_id: userId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: 404,
        message: "Not found comment.",
      });
    }

    return res.status(200).json({ comment });
  }

  static async store(req, res) {
    const { userId } = req;
    const { comment } = req.body;
    const { interpretation_id } = req.params;

    if (
      !(await Interpretation.findOne({
        where: { id: interpretation_id },
      }))
    ) {
      return res.status(409).json({
        error: 409,
        message: "Interpretation not found to id.",
      });
    }

    const model = await Comment.create({
      comment,
      user_id: userId,
      interpretation_id,
    });

    return res.status(201).json({ comment: model });
  }

  static async update(req, res) {
    const { userId } = req;
    const { comment } = req.body;
    const { id, interpretation_id } = req.params;

    const model = await Comment.findOne({
      where: {
        id,
        interpretation_id,
      },
    });

    if (!model) {
      return res.status(404).json({
        error: 404,
        message: "Not found comment",
      });
    }

    if (model.user_id !== userId) {
      return res.status(403).json({
        error: 403,
        message: "You not have access this resource.",
      });
    }

    model.comment = comment;
    await model.save();

    return res.status(200).json({ comment: model });
  }

  static async destroy(req, res) {
    const { userId } = req;
    const { id, interpretation_id } = req.params;

    const comment = await Comment.findOne({
      where: {
        id,
        interpretation_id,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: 404,
        message: "Not found comment.",
      });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        error: 403,
        message: "You not have access this resource.",
      });
    }

    await Comment.destroy({ where: { id } });

    return res.status(204).end();
  }
}
