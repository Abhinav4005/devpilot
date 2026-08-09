import { z } from "zod";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";

export const createInvitationSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .transform((email) => email.toLowerCase()),

        role: z
            .nativeEnum(WorkspaceRole)
            .default(WorkspaceRole.MEMBER)
    }),

    params: z.object({
        workspaceId: z.string()
    })
});

export const tokenParamSchema = z.object({
    params: z.object({
        token: z.string().min(1, "Invitation token is required")
    })
});

export const cancelInvitationSchema = z.object({
    params: z.object({
        workspaceId: z.string(),
        invitationId: z.string()
    })
});