import mongoose from "mongoose";

const AdministrativeSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      required: true,
      unique: true,
      comment: "Numéro de contrat unique",
    },
    contractStartDate: {
      type: Date,
      required: true,
      comment: "Date de début du contrat",
    },
    contractEndDate: {
      type: Date,
      required: true,
      comment: "Date de fin du contrat",
    },
    purchasePrice: {
      type: Number,
      required: true,
      comment: "Prix d'achat en €/MWh",
    },
    contractType: {
      type: String,
      required: true,
      enum: ["CRE", "PPA", "autoconsommation", "autre"],
      comment: "Type de contrat",
    },
    status: {
      type: String,
      required: true,
      enum: ["en_construction", "en_service", "en_maintenance", "hors_service"],
      default: "en_construction",
      comment: "Statut du parc",
    },
  },
  {
    timestamps: true,
  }
);

export default AdministrativeSchema;
