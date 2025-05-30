import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import { checkBlacklist } from "./middlewares/blacklist.middleware.js";

// Charger le bon fichier d'environnement
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

console.log("MONGO_URL:", process.env.MONGO_URL);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API" });
});

// Pour le middleware d'erreur (doit être le dernier)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connecté à la base de données MongoDB");
  })
  .catch((err) => {
    console.log("Erreur de connexion à la base de données MongoDB", err);
  });

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(5000, () => {
    console.log("Serveur tourne sur le port 5000");
  });
}

export { app };
