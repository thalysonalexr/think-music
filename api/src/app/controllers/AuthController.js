import { generateTokenCrypto } from "../utils";

import { Mailer } from "../../services/mailer";

import User from "../models/User";
import RevokedTokens from "../models/RevokedToken";

export class AuthController {
  static async auth(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user || user.role === "disabled") {
      return res.status(401).json({
        error: 401,
        password: "User not exists.",
      });
    }

    if (!(await user.validatePassword(password))) {
      return res.status(401).json({
        error: 401,
        message: "Password is incorrect.",
      });
    }

    user.password = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    const token = await user.generateTokenJwt();

    return res.status(200).json({ user, token });
  }

  static async register(req, res) {
    const { email } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({
        error: 409,
        message: "User already exists.",
      });
    }

    const { name, password } = req.body;
    const role = req?.role === "admin" ? "admin" : "user";

    const user = await User.create({
      name,
      role,
      email,
      password,
    });

    user.password = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    const token = await user.generateTokenJwt();

    return res.status(201).json({ user, token });
  }

  static async initRecovery(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: 404,
        message: "User not found.",
      });
    }

    const token = generateTokenCrypto();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const mailer = new Mailer();

    await mailer.sendMail({
      to: email,
      subject: "Forgot Password?",
      template: "auth/forgot_password",
      context: { token },
    });

    return res.status(204).end();
  }

  static async resetPassword(req, res) {
    const { email, token, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: 404,
        message: "User not found.",
      });
    }

    const revokedToken = await RevokedTokens.findOne({
      where: {
        token: token,
        user_id: user.id,
      },
    });

    if (revokedToken) {
      return res.status(401).json({
        error: 401,
        message: "The token has already been used.",
      });
    }

    if (token !== user.passwordResetToken) {
      return res.status(401).json({
        error: 401,
        message: "Token invalid.",
      });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(401).json({
        error: 401,
        message: "Token expired. Generate a new token.",
      });
    }

    user.password = password;

    await user.save();

    await RevokedTokens.create({
      token,
      user_id: user.id,
    });

    return res.status(204).end();
  }
}
