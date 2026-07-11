import { z } from "zod";
import { WorkspaceVisibility } from "./workspace.enum.js";

export const workspaceSchema = z.object({
    body: z.object({
        name: z.
            string()
            .min(3, "Workspace name must be at least 3 characters")
            .max(100, "Workspace name cannot exceed 100 characters")
            .trim(),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        logo: z
            .string()
            .trim()
            .url("Invalid image url")
            .optional(),

        visibility: z
            .nativeEnum(WorkspaceVisibility)
            .default(WorkspaceVisibility.PRIVATE)
        
    })
})

export const updateWorkspaceSchema = z.object({
    body: workspaceSchema.shape.body.partial(),
})