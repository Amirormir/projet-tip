import express from "express";
import { createPark } from "../controllers/park.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createPark);

export default router;
