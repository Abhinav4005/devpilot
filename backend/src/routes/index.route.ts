import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import healthRoutes from "./health.routes.js";
import workspaceRoutes from "../modules/workspace/workspace.routes.js";
import invitationRoutes from "../modules/invitations/invitation.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/", healthRoutes);

router.use("/workspaces", workspaceRoutes);

router.use("/", invitationRoutes);

export default router;