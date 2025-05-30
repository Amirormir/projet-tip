import mongoose from "mongoose";

const TechnicalSchema = new mongoose.Schema(
  {
    installedPower: {
      type: Number,
      required: true,
      comment: "Puissance installée en MWc",
    },
    totalSurface: {
      type: Number,
      required: true,
      comment: "Surface totale en m²",
    },
    panelCount: {
      type: Number,
      required: true,
      comment: "Nombre total de panneaux",
    },
    panelType: {
      type: String,
      required: true,
      comment: "Type de panneaux utilisés",
    },
    inverterType: {
      type: String,
      required: true,
      comment: "Type d'onduleurs utilisés",
    },
    panelOrientation: {
      type: Number,
      required: true,
      comment: "Orientation des panneaux en degrés",
    },
    panelTilt: {
      type: Number,
      required: true,
      comment: "Inclinaison des panneaux en degrés",
    },
    installationType: {
      type: String,
      required: true,
      enum: ["terrestre", "toiture", "ombrières", "autre"],
      comment: "Type d'installation",
    },
  },
  {
    timestamps: true,
  }
);

export default TechnicalSchema;
