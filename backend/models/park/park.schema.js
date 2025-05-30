import mongoose from "mongoose";
import LocationSchema from "./location.schema.js";
import TechnicalSchema from "./technical.schema.js";
import AdministrativeSchema from "./administrative.schema.js";
import MaintenanceSchema from "./maintenance.schema.js";
import PerformanceSchema from "./performance.schema.js";
import {
  validateAddress,
  validateZipCode,
  validateCity,
} from "../common/address.validator.js";
import { validatePhone } from "../common/contact.validator.js";

const ParkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      comment: "Nom du parc",
      validate: {
        validator: function (v) {
          if (!v || v.length < 3 || v.length > 100) {
            throw new Error(
              "Le nom du parc doit contenir entre 3 et 100 caractères"
            );
          }
          return true;
        },
      },
    },
    parkId: {
      type: String,
      required: true,
      unique: true,
      comment: "Identifiant unique du parc",
    },
    commissioningDate: {
      type: Date,
      required: true,
      comment: "Date de mise en service",
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    technical: {
      type: TechnicalSchema,
      required: true,
    },
    administrative: {
      type: AdministrativeSchema,
      required: true,
    },
    maintenance: {
      type: MaintenanceSchema,
      required: true,
    },
    performance: {
      type: PerformanceSchema,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      comment: "Utilisateur qui a créé le parc",
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      comment: "Dernier utilisateur qui a modifié le parc",
    },
    address: {
      type: String,
      required: true,
      validate: {
        validator: validateAddress,
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
    contactPhone: {
      type: String,
      required: true,
      validate: {
        validator: validatePhone,
      },
    },
    contactEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
            throw new Error("L'adresse email est invalide");
          }
          return true;
        },
      },
    },
    totalPower: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v <= 0) {
            throw new Error("La puissance totale doit être supérieure à 0");
          }
          return true;
        },
      },
    },
    installationDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v || !(v instanceof Date)) {
            throw new Error("La date d'installation est invalide");
          }
          if (v > new Date()) {
            throw new Error(
              "La date d'installation ne peut pas être dans le futur"
            );
          }
          return true;
        },
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["actif", "inactif", "maintenance"],
      default: "actif",
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche géospatiale
ParkSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model("Park", ParkSchema);
