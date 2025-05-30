// register.validator.js
import Joi from "joi";

// Schémas de validation
const authSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .min(8)
      .required(),
    profil: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      birthDate: Joi.date().iso().required(),
      gender: Joi.string().valid("homme", "femme").required(),
      phone: Joi.string().pattern(new RegExp("^\\+[0-9]{10,15}$")).required(),
    }).required(),
    address: Joi.object({
      address: Joi.string().required(),
      addressComplement: Joi.string().allow(""),
      city: Joi.string().required(),
      zipCode: Joi.string().pattern(new RegExp("^[0-9]{5}$")).required(),
      country: Joi.string().required(),
    }).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  logout: Joi.object({
    accessToken: Joi.string().required(),
  }),
};

// Middleware de validation
export const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = authSchemas[schemaName];
    if (!schema) {
      return next(new Error(`Schéma de validation '${schemaName}' non trouvé`));
    }

    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        status: "FAILED",
        message: "Erreur de validation",
        errors: validationErrors,
      });
    }

    next();
  };
};

// Export des middlewares spécifiques
export const validateRegister = validateRequest("register");
export const validateLogin = validateRequest("login");
export const validateRefreshToken = validateRequest("refreshToken");
export const validateLogout = validateRequest("logout");
