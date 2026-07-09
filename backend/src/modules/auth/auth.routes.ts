import express from "express";
import { Validate } from "../../common/middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../common/middleware/async.middleware.js";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/authentication.middleare.js";

const router = express.Router();

router.post("/register", Validate(registerSchema), asyncHandler(authController.register))

router.post("/login", Validate(loginSchema), asyncHandler(authController.login))

router.get("/me", authenticate, );

export default router;