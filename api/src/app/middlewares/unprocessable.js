import User from "../models/User";

export const unprocessableMiddleware = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (user?.role !== "disabled") return next();

    return res.status(422).json({
      error: 422,
      message: "This user are inactive or latest removed.",
    });
  } catch {
    return res.status(503).json({
      error: 503,
      message: "Service Unavailable",
    });
  }
};
