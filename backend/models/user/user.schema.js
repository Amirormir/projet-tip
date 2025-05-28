import mongoose from "mongoose";
import validator from "validator";
import AddressSchema from "./adress.schema.js";
import ProfilSchema from "./profile.schema.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          if (!validator.isLength(v, { min: 3, max: 20 })) {
            throw new Error(
              "Le nom d'utilisateur doit être compris entre 3 et 20 caractères"
            );
          }
          if (/\d+/.test(v)) {
            throw new Error(
              "Le nom d'utilisateur ne peut pas contenir de chiffres"
            );
          }
          return true;
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          if (!validator.isEmail(v)) {
            throw new Error("L'email est invalide");
          }
          return true;
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const isStrong = validator.isStrongPassword(v, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
          if (!isStrong) {
            throw new Error(
              "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole"
            );
          }
          return true;
        },
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole",
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "tech"],
      default: "user",
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    profil: {
      type: ProfilSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
