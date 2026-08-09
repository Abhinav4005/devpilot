import { z} from "zod";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";

export const invitationSchema = z.object({
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
})

export const updateInvitationSchema = z.object({
    
})