import request from "supertest";
import { app } from "../index.js";
import User from "../models/user/user.schema.js";
import mongoose from "mongoose";

// Configuration du timeout pour les tests
const TIMEOUT = 30000;

describe("Tests d'authentification", () => {
  let testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
    role: "user",
    address: {
      address: "123 Rue de Test",
      addressComplement: "Appartement 4B",
      city: "Paris",
      zipCode: "75001",
      country: "France",
    },
    profil: {
      firstName: "Jean",
      lastName: "Dupont",
      birthDate: "1990-01-01",
      gender: "homme",
      phone: "0612345678",
    },
  };

  // Connexion à la base de données avant tous les tests
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connecté à la base de données de test");
    } catch (error) {
      console.error("Erreur de connexion à la base de données de test:", error);
      throw error;
    }
  });

  // Déconnexion de la base de données après tous les tests
  afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log("Déconnecté de la base de données de test");
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion de la base de données:",
        error
      );
    }
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("devrait créer un nouvel utilisateur avec tous les champs requis", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Utilisateur créé avec succès"
      );
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("email", testUser.email);
      expect(response.body.data.user).toHaveProperty(
        "username",
        testUser.username
      );
      expect(response.body.data.user).toHaveProperty("role", testUser.role);
      expect(response.body.data.user).toHaveProperty("address");
      expect(response.body.data.user).toHaveProperty("profil");
    });

    it("devrait refuser l'inscription avec un email déjà utilisé", async () => {
      // Créer d'abord un utilisateur
      await request(app).post("/api/auth/register").send(testUser);

      // Essayer de créer un autre utilisateur avec le même email
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Cet email ou nom d'utilisateur est déjà utilisé"
      );
    });

    it("devrait refuser l'inscription avec un username déjà utilisé", async () => {
      // Créer d'abord un utilisateur
      await request(app).post("/api/auth/register").send(testUser);

      // Essayer de créer un autre utilisateur avec le même username
      const newUser = { ...testUser, email: "autre@example.com" };
      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Cet email ou nom d'utilisateur est déjà utilisé"
      );
    });

    it("devrait refuser l'inscription avec un mot de passe invalide", async () => {
      const invalidUser = {
        ...testUser,
        password: "weak",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "FAILED");
      expect(response.body).toHaveProperty("message");
    });

    it("devrait refuser l'inscription avec une date de naissance invalide (mineur)", async () => {
      const minorUser = {
        ...testUser,
        profil: {
          ...testUser.profil,
          birthDate: "2010-01-01",
        },
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(minorUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "User validation failed: profil.birthDate: L'utilisateur doit être majeur"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de connexion
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("devrait connecter un utilisateur avec des identifiants valides", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("email", testUser.email);
      expect(response.body.data.user).toHaveProperty(
        "username",
        testUser.username
      );
    });

    it("devrait refuser la connexion avec un mot de passe incorrect", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "mauvaispassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Identifiants invalides");
    });

    it("devrait refuser la connexion avec un email inexistant", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "inexistant@example.com",
        password: testUser.password,
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Identifiants invalides");
    });
  });

  describe("POST /api/auth/logout", () => {
    let authToken;

    beforeEach(async () => {
      // Créer un utilisateur et obtenir un token
      await request(app).post("/api/auth/register").send(testUser);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      authToken = loginResponse.body.data.accessToken;
    });

    it("devrait déconnecter un utilisateur connecté", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ accessToken: authToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Déconnexion réussie");
    });

    it("devrait refuser la déconnexion sans token", async () => {
      const response = await request(app).post("/api/auth/logout").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status", "FAILED");
      expect(response.body).toHaveProperty("message", "Token d'accès requis");
    });

    it("devrait refuser la déconnexion avec un token invalide", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer invalid_token")
        .send({ accessToken: "invalid_token" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Token invalide");
    });
  });
});
