import User from "../models/User";

export const authorizationMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
        role: "admin",
      },
    });

    if (user?.role === "admin") {
      req.role = "admin";
      return next();
    }

    return res.status(403).json({
      error: 403,
      message: "Forbidden the access to resource.",
    });
  } catch {
    return res.status(503).json({
      error: 503,
      message: "Service Unavailable",
    });
  }
};
