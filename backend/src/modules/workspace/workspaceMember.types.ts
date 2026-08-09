import { Types } from "mongoose";
import { WorkspaceRole } from "./workspaceMember.enum.js";

export interface CreateWorkspaceMemberDto {
    workspaceId: Types.ObjectId;
    userId: string;
    role: WorkspaceRole;
}
