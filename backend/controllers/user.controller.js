import User from "../models/user/user.schema.js";

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
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log("Utilisateurs trouvés:", users);
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
