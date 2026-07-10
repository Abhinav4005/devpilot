import express from "express";
import { Validate } from "../../common/middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../common/middleware/async.middleware.js";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/authentication.middleware.js";

const router = express.Router();

router.post("/register", Validate(registerSchema), asyncHandler(authController.register))

router.post("/login", Validate(loginSchema), asyncHandler(authController.login))

router.get("/me", authenticate, asyncHandler(authController.me));

router.post("/refresh-token", asyncHandler(authController.refresh))

router.post("/logout", asyncHandler(authController.logout))

export default router;