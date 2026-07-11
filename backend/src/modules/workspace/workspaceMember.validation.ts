import { z } from "zod";
import { WorkspaceRole } from "./workspaceMember.enum.js";

export const workspaceMemberSchema = z.object({
    body: z.object({
        role: z
            .nativeEnum(WorkspaceRole)
            .default(WorkspaceRole.ADMIN)
    })
})