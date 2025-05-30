import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["préventive", "corrective", "inspection"],
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v.length < 10 || v.length > 500) {
            throw new Error(
              "La description doit contenir entre 10 et 500 caractères"
            );
          }
          return true;
        },
      },
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || !(v instanceof Date)) {
            throw new Error("La date de début est invalide");
          }
          return true;
        },
      },
    },
    endDate: {
      type: Date,
      required: false,
      validate: {
        validator: function (v) {
          if (v && !(v instanceof Date)) {
            throw new Error("La date de fin est invalide");
          }
          if (v && v < this.startDate) {
            throw new Error(
              "La date de fin ne peut pas être antérieure à la date de début"
            );
          }
          return true;
        },
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["planifiée", "en cours", "terminée", "annulée"],
      default: "planifiée",
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cost: {
      type: Number,
      required: false,
      validate: {
        validator: function (v) {
          if (v && v < 0) {
            throw new Error("Le coût ne peut pas être négatif");
          }
          return true;
        },
      },
    },
    notes: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (v && (v.length < 5 || v.length > 1000)) {
            throw new Error(
              "Les notes doivent contenir entre 5 et 1000 caractères"
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

export default MaintenanceSchema;
