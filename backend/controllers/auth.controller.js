import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user/user.schema.js";
import { AuthErrors } from "../errors/auth.errors.js";
import tokenService from "../services/token.service.js";
import Blacklist from "../models/blacklist.js";

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      profil: { firstName, lastName, birthDate, gender, phone },
      address: { address, addressComplement, city, zipCode, country },
    } = req.body;

    // Créer l'utilisateur pour la validation
    const newUser = new User({
      username,
      email,
      password,
      profil: {
        firstName,
        lastName,
        birthDate,
        gender,
        phone,
      },
      address: {
        address,
        addressComplement,
        city,
        zipCode,
        country,
      },
    });

    // Valider l'utilisateur
    await newUser.validate();

    // Hash le mot de passe après validation
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;

    const savedUser = await newUser.save();
    console.log("Utilisateur sauvegardé:", savedUser);

    try {
      // Générer les tokens
      const tokens = tokenService.generateTokenPair(savedUser);
      console.log("Tokens générés avec succès");

      res.status(201).json({
        status: "SUCCESS",
        message: "Utilisateur créé avec succès",
        data: {
          user: savedUser,
          ...tokens,
        },
      });
    } catch (tokenError) {
      console.error("Erreur lors de la génération des tokens:", tokenError);
      // On renvoie quand même l'utilisateur créé, mais sans les tokens
      res.status(201).json({
        status: "PARTIAL_SUCCESS",
        message:
          "Utilisateur créé mais erreur lors de la génération des tokens",
        data: {
          user: savedUser,
        },
      });
    }
  } catch (err) {
    console.error("Erreur complète:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "FAILED",
        message: AuthErrors.VALIDATION_FAILED,
        error: err.message,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        status: "FAILED",
        message: AuthErrors.USER_ALREADY_EXISTS,
      });
    }

    res.status(500).json({
      status: "FAILED",
      message: AuthErrors.INTERNAL_SERVER_ERROR,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.INVALID_CREDENTIALS,
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.INVALID_CREDENTIALS,
      });
    }

    // Générer les tokens
    const tokens = tokenService.generateTokenPair(user);

    res.status(200).json({
      status: "SUCCESS",
      message: "Connexion réussie",
      data: {
        user,
        ...tokens,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: AuthErrors.INTERNAL_SERVER_ERROR,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Vérifier le refresh token
    const decoded = tokenService.verifyRefreshToken(refreshToken);

    // Trouver l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.INVALID_REFRESH_TOKEN,
      });
    }

    // Générer une nouvelle paire de tokens
    const tokens = tokenService.generateTokenPair(user);

    res.status(200).json({
      status: "SUCCESS",
      message: "Tokens rafraîchis avec succès",
      data: tokens,
    });
  } catch (err) {
    res.status(401).json({
      status: "FAILED",
      message: AuthErrors.INVALID_REFRESH_TOKEN,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { accessToken } = req.body; // Récupérer le token depuis le body

    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    if (checkIfBlacklisted) {
      return res.status(401).json({
        status: "FAILED",
        message: AuthErrors.INVALID_ACCESS_TOKEN,
      });
    }

    const newBlacklist = new Blacklist({
      token: accessToken,
    });

    await newBlacklist.save();

    res.status(200).json({
      status: "SUCCESS", // Correction de "SUCCES" à "SUCCESS"
      message: "Déconnexion réussie",
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: AuthErrors.INTERNAL_SERVER_ERROR,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
