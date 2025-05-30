import Park from "../models/park/park.schema.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const createPark = async (req, res, next) => {
  try {
    // Vérifier l'authentification
    await authenticate(req, res, next);

    const {
      name,
      parkId,
      commissioningDate,
      location,
      technical,
      administrative,
      maintenance,
      performance,
      address,
      city,
      zipCode,
      country,
      contactPhone,
      contactEmail,
      totalPower,
      installationDate,
      status,
    } = req.body;

    const newPark = new Park({
      name,
      parkId,
      commissioningDate,
      location,
      technical,
      administrative,
      maintenance,
      performance,
      address,
      city,
      zipCode,
      country,
      contactPhone,
      contactEmail,
      totalPower,
      installationDate,
      status,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
    });

    const savedPark = await newPark.save();

    res.status(201).json({
      status: "SUCCESS",
      message: "Parc créé avec succès",
      data: savedPark,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "FAILED",
        message: err.message,
      });
    }
    next(err);
  }
};
