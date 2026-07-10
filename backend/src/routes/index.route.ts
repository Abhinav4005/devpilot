import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import healthRoutes from "./health.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/", healthRoutes);

export default router;