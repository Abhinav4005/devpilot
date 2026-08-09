import { z } from "zod";
import { invitationSchema } from "./invitation.validation.js";
import { InvitationStatus } from "./invitation.enum.js";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";
import { Types } from "mongoose";

export type CreateInvitationDto = z.infer<typeof invitationSchema>['body'];

export interface updateInvitationDto {
    status?: InvitationStatus;
    acceptedAt?: Date;
    rejectedAt?: Date;
    token?: string | null;
    role?: WorkspaceRole;
}

export interface invitationResponse {
    workspaceId: Types.ObjectId;
    userId: Types.ObjectId;
    email: string;
    invitedBy: Types.ObjectId;
    role: string;
    status: string;
}