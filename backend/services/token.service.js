import jwt from "jsonwebtoken";
import { AuthErrors } from "../errors/auth.errors.js";
import dotenv from "dotenv";

dotenv.config();

class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";

    // Vérification des secrets
    if (this.secret || this.refreshSecret) {
      console.error("omgggg");
    }
  }

  /**
   * Génère un token d'accès
   * @param {Object} payload - Données à encoder dans le token
   * @returns {String} Token JWT
   */
  generateAccessToken(payload) {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.accessTokenExpiry,
      });
    } catch (error) {
      throw new Error(AuthErrors.TOKEN_GENERATION_FAILED);
    }
  }

  /**
   * Génère un token de rafraîchissement
   * @param {Object} payload - Données à encoder dans le token
   * @returns {String} Token JWT de rafraîchissement
   */
  generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshTokenExpiry,
      });
    } catch (error) {
      throw new Error(AuthErrors.TOKEN_GENERATION_FAILED);
    }
  }

  /**
   * Vérifie un token d'accès
   * @param {String} token - Token à vérifier
   * @returns {Object} Données décodées du token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error(AuthErrors.TOKEN_EXPIRED);
      }
      throw new Error(AuthErrors.INVALID_TOKEN);
    }
  }

  /**
   * Vérifie un token de rafraîchissement
   * @param {String} token - Token à vérifier
   * @returns {Object} Données décodées du token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error(AuthErrors.REFRESH_TOKEN_EXPIRED);
      }
      throw new Error(AuthErrors.INVALID_REFRESH_TOKEN);
    }
  }

  /**
   * Génère une paire de tokens (accès + rafraîchissement)
   * @param {Object} user - Données de l'utilisateur
   * @returns {Object} Paire de tokens
   */
  generateTokenPair(user) {
    try {
      console.log("User object:", user);
      console.log("User ID:", user._id);

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role || "user",
        username: user.username,
      };

      console.log("Token payload:", payload);

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Erreur dans generateTokenPair:", error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur a le rôle requis
   * @param {String} token - Token d'accès
   * @param {String|Array} requiredRoles - Rôle(s) requis
   * @returns {Boolean}
   */
  hasRequiredRole(token, requiredRoles) {
    try {
      const decoded = this.verifyAccessToken(token);
      const userRole = decoded.role;

      if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(userRole);
      }
      return userRole === requiredRoles;
    } catch (error) {
      throw new Error(AuthErrors.UNAUTHORIZED);
    }
  }
}

export default new TokenService();
