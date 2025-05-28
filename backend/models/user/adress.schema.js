import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!validator.isLength(v, { min: 3, max: 100 })) {
            throw new Error(
              "L'adresse doit contenir entre 3 et 100 caractères"
            );
          }
          return true;
        },
      },
    },
    addressComplement: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (v && !validator.isLength(v, { min: 3, max: 100 })) {
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
        validator: function (v) {
          if (!validator.isLength(v, { min: 2, max: 50 })) {
            throw new Error("La ville doit contenir entre 2 et 50 caractères");
          }
          return true;
        },
      },
    },
    zipCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!validator.isPostalCode(v, "FR")) {
            throw new Error("Le code postal est invalide");
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

export default AddressSchema;
