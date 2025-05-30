import { AuthErrors } from "../errors/auth.errors.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Erreur:", err);

  // Erreurs de validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "FAILED",
      message: AuthErrors.VALIDATION_FAILED,
      error: err.message,
    });
  }

  // Erreurs de duplication MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      status: "FAILED",
      message: AuthErrors.USER_ALREADY_EXISTS,
    });
  }

  // Erreurs JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "FAILED",
      message: AuthErrors.INVALID_TOKEN,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "FAILED",
      message: AuthErrors.TOKEN_EXPIRED,
    });
  }

  // Erreur par défaut
  res.status(500).json({
    status: "FAILED",
    message: AuthErrors.INTERNAL_SERVER_ERROR,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
