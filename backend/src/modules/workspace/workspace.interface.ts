import { HydratedDocument, Types } from "mongoose";
import { WorkspaceVisibility } from "./workspace.enum.js";

export interface IWorkspace {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    owner: Types.ObjectId;
    visibility: WorkspaceVisibility;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type WorkspaceDocument = HydratedDocument<IWorkspace>