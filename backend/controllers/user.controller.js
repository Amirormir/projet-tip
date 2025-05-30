import User from "../models/user/user.schema.js";
import { AuthErrors } from "../errors/auth.errors.js";

// Créer un utilisateur
export const createUser = async (req, res) => {
  try {
    console.log("Données reçues:", req.body);
    const user = new User(req.body);
    console.log("Nouvel utilisateur créé:", user);
    await user.save();
    console.log("Utilisateur sauvegardé avec succès");
    res.status(201).json(user);
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "SUCCESS",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: AuthErrors.USER_NOT_FOUND,
      });
    }
    res.status(200).json({
      status: "SUCCESS",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: AuthErrors.USER_NOT_FOUND,
      });
    }

    // Vérifier si l'utilisateur a le droit de modifier
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "FAILED",
        message: AuthErrors.FORBIDDEN,
      });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      status: "SUCCESS",
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: AuthErrors.USER_NOT_FOUND,
      });
    }

    // Vérifier si l'utilisateur a le droit de supprimer
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "FAILED",
        message: AuthErrors.FORBIDDEN,
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: "SUCCESS",
      message: "Utilisateur supprimé avec succès",
    });
  } catch (err) {
    next(err);
  }
};

// Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: AuthErrors.USER_NOT_FOUND,
      });
    }
    res.status(200).json({
      status: "SUCCESS",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Mettre à jour le profil de l'utilisateur connecté
export const updateProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      status: "SUCCESS",
      message: "Profil mis à jour avec succès",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
