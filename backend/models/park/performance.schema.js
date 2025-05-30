import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || !(v instanceof Date)) {
            throw new Error("La date est invalide");
          }
          if (v > new Date()) {
            throw new Error("La date ne peut pas être dans le futur");
          }
          return true;
        },
      },
    },
    energyProduction: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v < 0) {
            throw new Error(
              "La production d'énergie ne peut pas être négative"
            );
          }
          return true;
        },
      },
    },
    efficiency: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v < 0 || v > 100) {
            throw new Error("L'efficacité doit être comprise entre 0 et 100");
          }
          return true;
        },
      },
    },
    temperature: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v < -50 || v > 100) {
            throw new Error(
              "La température doit être comprise entre -50 et 100 degrés"
            );
          }
          return true;
        },
      },
    },
    weatherConditions: {
      type: String,
      required: true,
      enum: ["ensoleillé", "nuageux", "pluvieux", "neigeux", "orageux"],
    },
    notes: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (v && (v.length < 5 || v.length > 500)) {
            throw new Error(
              "Les notes doivent contenir entre 5 et 500 caractères"
            );
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

export default PerformanceSchema;
