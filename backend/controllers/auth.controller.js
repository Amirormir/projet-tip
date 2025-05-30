import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user/user.schema.js";
import { AuthErrors } from "../errors/auth.errors.js";
import tokenService from "../services/token.service.js";
import Blacklist from "../models/blacklist.js";
import { validatePassword } from "../validators/user.validator.js";

export const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      profil: { firstName, lastName, birthDate, gender, phone },
      address: { address, addressComplement, city, zipCode, country },
    } = req.body;

    // Valider le mot de passe
    try {
      validatePassword(password);
    } catch (error) {
      return res.status(400).json({
        status: "FAILED",
        message: error.message,
      });
    }

    // Créer l'utilisateur
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

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;

    // Sauvegarder l'utilisateur
    const savedUser = await newUser.save();

    // Générer les tokens
    const tokens = tokenService.generateTokenPair(savedUser);

    res.status(201).json({
      status: "SUCCESS",
      message: "Utilisateur créé avec succès",
      data: {
        user: savedUser,
        ...tokens,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "FAILED",
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        status: "FAILED",
        message: "Cet email ou nom d'utilisateur est déjà utilisé",
      });
    }
    if (err.message && err.message.includes("mot de passe")) {
      return res.status(400).json({
        status: "FAILED",
        message: err.message,
      });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
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
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
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
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        status: "FAILED",
        message: "Token d'accès requis",
      });
    }

    // Vérifier si le token est valide
    try {
      tokenService.verifyAccessToken(accessToken);
    } catch (error) {
      return res.status(401).json({
        status: "FAILED",
        message: "Token invalide",
      });
    }

    // Vérifier si le token n'est pas déjà dans la blacklist
    const existingToken = await Blacklist.findOne({ token: accessToken });
    if (existingToken) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Déconnexion réussie",
      });
    }

    // Ajouter le token à la blacklist
    const newBlacklist = new Blacklist({
      token: accessToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dans 24h
    });

    await newBlacklist.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Déconnexion réussie",
    });
  } catch (err) {
    next(err);
  }
};
