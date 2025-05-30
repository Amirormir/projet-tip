import Blacklist from "../models/blacklist.js";
import { AuthErrors } from "../errors/auth.errors.js";

export const checkBlacklist = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.NO_TOKEN_PROVIDED,
      });
    }

    const token = authHeader.split(" ")[1];
    const isBlacklisted = await Blacklist.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.TOKEN_BLACKLISTED,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: AuthErrors.INTERNAL_SERVER_ERROR,
    });
  }
};
