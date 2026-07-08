import express from "express";
import { Validate } from "../../common/middleware/validate.middleware.js";
import { registerSchema } from "./auth.validation.js";
import { asyncHandler } from "../../common/middleware/async.middleware.js";
import { authController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", Validate(registerSchema), asyncHandler(authController.register))

export default router;