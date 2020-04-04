import User from "../models/User";

export class AdminController {
  static async disableUser(req, res) {
    const { id } = req.params;
    const { status } = req.query;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: 404,
        message: "User not found.",
      });
    }

    user.role = !status ? "disabled" : "user";

    await user.save();

    user.password = undefined;

    return res.status(200).json({ user });
  }
}
