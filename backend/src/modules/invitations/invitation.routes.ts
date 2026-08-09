import express from "express";
import { authenticate } from "../../common/middleware/authentication.middleware.js";
import { asyncHandler } from "../../common/middleware/async.middleware.js";
import { Validate } from "../../common/middleware/validate.middleware.js";
import { invitationController } from "./invitation.controller.js";
import { createInvitationSchema, tokenParamSchema, cancelInvitationSchema } from "./invitation.validation.js";

const router = express.Router();

router.post(
    "/workspaces/:workspaceId/invitations",
    authenticate,
    Validate(createInvitationSchema),
    asyncHandler(invitationController.create)
);

router.post(
    "/invitations/:token/accept",
    authenticate,
    Validate(tokenParamSchema),
    asyncHandler(invitationController.accept)
);

router.post(
    "/invitations/:token/reject",
    authenticate,
    Validate(tokenParamSchema),
    asyncHandler(invitationController.reject)
);

router.delete(
    "/workspaces/:workspaceId/invitations/:invitationId",
    authenticate,
    Validate(cancelInvitationSchema),
    asyncHandler(invitationController.cancel)
);

export default router;
