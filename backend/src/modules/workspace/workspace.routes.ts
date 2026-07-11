import express from "express";
import { authenticate } from "../../common/middleware/authentication.middleware.js";
import { asyncHandler } from "../../common/middleware/async.middleware.js";
import { workspaceController } from "./workspace.controller.js";
import { Validate } from "../../common/middleware/validate.middleware.js";
import { updateWorkspaceSchema, workspaceSchema } from "./workspace.validation.js";

const router = express.Router();

router.post("/", authenticate, Validate(workspaceSchema), asyncHandler(workspaceController.create));

router.get("/", authenticate, asyncHandler(workspaceController.getMyWorkspaces));

router.get("/:id", authenticate, asyncHandler(workspaceController.getById));

router.patch("/:id", authenticate, Validate(updateWorkspaceSchema), asyncHandler(workspaceController.update));

router.patch("/:id/archive", authenticate, Validate(updateWorkspaceSchema), asyncHandler(workspaceController.archive));

router.patch("/:id/unarchive", authenticate, Validate(updateWorkspaceSchema), asyncHandler(workspaceController.unarchive));

export default router;