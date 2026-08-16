import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";
import { AppError } from "../../common/errors/AppError.js";
import { workspaceRepository } from "../workspace/workspace.repository.js";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";
import { CreateInvitationDto } from "./invitation.types.js";
import { workspaceMemberRepository } from "../workspace/workspaceMember.repository.js";
import { authRepository } from "../auth/auth.repository.js";
import { invitationRepository } from "./invitation.repository.js";
import crypto from "crypto";
import { InvitationStatus } from "./invitation.enum.js";
import { toInvitationResponse } from "./invitation.mapper.js";
import mongoose, { Types } from "mongoose";

export class InvitationService {
    async create(workspaceId: string, invitedBy: string, data: CreateInvitationDto) {
        const existingWorkspace = await workspaceRepository.findById(workspaceId);

        if (!existingWorkspace) {
            throw new AppError("Workspace not found", HTTP_STATUS.NOT_FOUND);
        }

        if (existingWorkspace.isArchived) {
            throw new AppError("Workspace is archived", HTTP_STATUS.BAD_REQUEST);
        }

        const inviteMembership = await workspaceMemberRepository.findMember(workspaceId, invitedBy);

        if (!inviteMembership || ![WorkspaceRole.OWNER, WorkspaceRole.ADMIN].includes(inviteMembership.role)) {
            throw new AppError("You are not authorized to invite members", HTTP_STATUS.FORBIDDEN);
        }

        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
        }

        const existingMember = await workspaceMemberRepository.findMember(workspaceId, user._id.toString());

        if (existingMember) {
            throw new AppError("User is already a member of this workspace", HTTP_STATUS.CONFLICT);
        }

        const pendingInvitation = await invitationRepository.findPendingInvitation(workspaceId, data.email);

        if (pendingInvitation) {
            throw new AppError("Invitation is already pending", HTTP_STATUS.CONFLICT);
        }

        const token = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto.createHash('sha256').update(token).digest("hex");

        const invitationPayload = {
            workspaceId,
            userId: user._id,
            invitedBy: invitedBy,
            email: user.email,
            role: data.role ?? WorkspaceRole.MEMBER,
            status: InvitationStatus.PENDING,
            token: hashedToken
        }
        const invitation = await invitationRepository.create(invitationPayload);

        return {
            invitation: toInvitationResponse(invitation),
            token
        }
    }

    async accept(token: string, userId: string) {
        const invitation = await this.validateInvitation(token, userId);

        const workspace = await workspaceRepository.findById(invitation.workspaceId.toString());

        if (!workspace) {
            throw new AppError("Workspace not found", HTTP_STATUS.NOT_FOUND);
        }

        if (workspace.isArchived) {
            throw new AppError("Workspace is archived", HTTP_STATUS.BAD_REQUEST);
        }

        if (userId !== invitation.userId.toString()) {
            throw new AppError("User is not authorized to accept this invitation", HTTP_STATUS.FORBIDDEN);
        }

        const existingMember = await workspaceMemberRepository.findMember(workspace.id, userId);

        if (existingMember) {
            throw new AppError("User is already a member of this workspace", HTTP_STATUS.CONFLICT);
        }
        const session = await mongoose.startSession();

        session.startTransaction();

        try {
            const payload = {
                workspaceId: new Types.ObjectId(workspace.id),
                userId,
                role: invitation.role
            }
            const member = await workspaceMemberRepository.create(payload, session);

            const invitationPayload = {
                status: InvitationStatus.ACCEPTED,
                token: null,
                acceptedAt: new Date(),
            }
            const updateInvitation = await invitationRepository.update(invitation.id, invitationPayload, session);

            if (!updateInvitation) {
                throw new AppError("Failed to update invitation", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            await session.commitTransaction();

            return {
                member,
                invitation: toInvitationResponse(updateInvitation)
            }
        } catch (error: any) {
            await session.abortTransaction();

            if (error?.code === 11000) {
                throw new AppError("User is already a member of this workspace", HTTP_STATUS.CONFLICT);
            }

            throw error;
        } finally {
            await session.endSession();
        }
    }

    async reject(token: string, userId: string) {
        const invitation = await this.validateInvitation(token, userId);

        const payload = {
            token: null,
            status: InvitationStatus.REJECTED,
            rejectedAt: new Date(),
        }
        const updateInvitation = await invitationRepository.update(invitation.id, payload);

        if (!updateInvitation) {
            throw new AppError("Failed to update invitation", HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }

        return toInvitationResponse(updateInvitation);
    }

    async cancel(invitationId: string, userId: string) {
        const invitation = await invitationRepository.findById(invitationId);

        if (!invitation) {
            throw new AppError("Invitation not found", HTTP_STATUS.NOT_FOUND);
        }

        const member = await workspaceMemberRepository.findMember(invitation.workspaceId.toString(), userId);

        if (!member) {
            throw new AppError("You are not member of this workspace", HTTP_STATUS.BAD_REQUEST);
        }

        if (![WorkspaceRole.ADMIN, WorkspaceRole.OWNER].includes(member.role)) {
            throw new AppError("You are not authorized to cancel this invitation", HTTP_STATUS.FORBIDDEN);
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new AppError(`Invitation is already ${invitation.status.toLowerCase()}`, HTTP_STATUS.BAD_REQUEST)
        }

        const payload = {
            status: InvitationStatus.CANCELLED,
            token: null,
        }

        const updateInvitation = await invitationRepository.update(invitation.id, payload);

        if (!updateInvitation) {
            throw new AppError("Failed to update invitation", HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }

        return toInvitationResponse(updateInvitation);

    }

    private async validateInvitation(token: string, userId: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest("hex");

        const invitation = await invitationRepository.findByToken(hashedToken);

        if (!invitation) {
            throw new AppError("No invitation found", HTTP_STATUS.NOT_FOUND);
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new AppError(
                `Invitation is already ${invitation.status.toLowerCase()}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        if (invitation.expiresAt < new Date()) {
            throw new AppError(
                "Invitation has expired",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        if (userId !== invitation.userId.toString()) {
            throw new AppError(
                "User is not authorized for this invitation",
                HTTP_STATUS.FORBIDDEN
            );
        }

        return invitation;
    }
}

export const invitationService = new InvitationService();