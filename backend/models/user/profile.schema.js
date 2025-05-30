import mongoose from "mongoose";
import { validatePhone } from "../../validators/common/contact.validator.js";

const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v.length < 2 || v.length > 50) {
            throw new Error("Le prénom doit contenir entre 2 et 50 caractères");
          }
          return true;
        },
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v.length < 2 || v.length > 50) {
            throw new Error("Le nom doit contenir entre 2 et 50 caractères");
          }
          return true;
        },
      },
    },
    birthDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || !(v instanceof Date)) {
            throw new Error("La date de naissance est invalide");
          }
          const age = new Date().getFullYear() - v.getFullYear();
          if (age < 18) {
            throw new Error("L'utilisateur doit être majeur");
          }
          return true;
        },
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["homme", "femme", "autre"],
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: validatePhone,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default ProfileSchema;
