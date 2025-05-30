import mongoose from "mongoose";
import AddressSchema from "./adress.schema.js";
import ProfilSchema from "./profile.schema.js";
import {
  validateUsername,
  validatePassword,
} from "../../validators/user.validator.js";
import { validateEmail } from "../../validators/common/contact.validator.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validateUsername,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validateEmail,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: validatePassword,
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
