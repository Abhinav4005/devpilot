import { z } from "zod";
import { updateWorkspaceSchema, workspaceSchema } from "./workspace.validation.js";

export type CreateWorkspaceDto = z.infer<typeof workspaceSchema>["body"];

export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>['body'];

export interface workspaceResponseDto {
    id: string,
    name: string,
    slug: string,
    logo?: string,
    owner: string,
    visibility: string,
}