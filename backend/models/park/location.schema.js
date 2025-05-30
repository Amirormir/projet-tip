import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "France",
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      altitude: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default LocationSchema;
