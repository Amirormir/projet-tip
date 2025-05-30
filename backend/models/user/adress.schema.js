import mongoose from "mongoose";
import {
  validateAddress,
  validateZipCode,
  validateCity,
} from "../../validators/common/address.validator.js";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      validate: {
        validator: validateAddress,
      },
    },
    addressComplement: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (v && (v.length < 3 || v.length > 100)) {
            throw new Error(
              "Le complément d'adresse doit contenir entre 3 et 100 caractères"
            );
          }
          return true;
        },
      },
    },
    city: {
      type: String,
      required: true,
      validate: {
        validator: validateCity,
      },
    },
    zipCode: {
      type: String,
      required: true,
      validate: {
        validator: validateZipCode,
      },
    },
    country: {
      type: String,
      required: true,
      default: "France",
    },
  },
  {
    timestamps: true,
  }
);

export default AddressSchema;
