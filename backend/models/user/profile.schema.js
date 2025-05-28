import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!validator.isLength(v, { min: 2, max: 50 })) {
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
          if (!validator.isLength(v, { min: 2, max: 50 })) {
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
          if (!validator.isDate(v)) {
            throw new Error("La date de naissance est invalide");
          }
          const age = new Date().getFullYear() - new Date(v).getFullYear();
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
        validator: function (v) {
          if (!validator.isMobilePhone(v, "fr-FR")) {
            throw new Error("Le numéro de téléphone est invalide");
          }
          return true;
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default ProfileSchema;
