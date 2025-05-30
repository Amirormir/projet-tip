import tokenService from "../services/token.service.js";
import { AuthErrors } from "../errors/auth.errors.js";

// Middleware pour vérifier l'authentification
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.NO_TOKEN_PROVIDED,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "FAILED",
      message: AuthErrors.INVALID_TOKEN,
    });
  }
};

// Middleware pour vérifier les rôles
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.UNAUTHORIZED,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "FAILED",
        message: AuthErrors.FORBIDDEN,
      });
    }

    next();
  };
};
