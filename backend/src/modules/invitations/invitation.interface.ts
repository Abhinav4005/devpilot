import { HydratedDocument, Types } from "mongoose";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";
import { InvitationStatus } from "./invitation.enum.js";

export interface IInvitation {
    workspaceId: Types.ObjectId,
    userId: Types.ObjectId,
    email: string,
    invitedBy: Types.ObjectId,
    role: WorkspaceRole,
    status: InvitationStatus,
    token: string,
    isArchived: Boolean,
    expiresAt: Date,
    acceptedAt?: Date,
    rejectedAt?: Date,
    createdAt: Date,
    updatedAt: Date,
}

export type InvitationDocument = HydratedDocument<IInvitation>;