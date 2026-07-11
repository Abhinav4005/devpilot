import { Types, HydratedDocument } from "mongoose";
import { WorkspaceRole } from "./workspaceMember.enum.js";

export interface IWorkspaceMember {
    workspaceId: Types.ObjectId,
    userId: Types.ObjectId,
    role: WorkspaceRole,
    joinedAt: Date,
}

export type WorkspaceMemberDocument = HydratedDocument<IWorkspaceMember>