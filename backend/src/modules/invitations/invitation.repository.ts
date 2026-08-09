import { ClientSession } from "mongoose";
import { InvitationStatus } from "./invitation.enum.js";
import { IInvitation, InvitationDocument } from "./invitation.interface.js";
import Invitation from "./invitation.model.js";
import { CreateInvitationDto, updateInvitationDto } from "./invitation.types.js";

export class InvitationRepository {
    async create(invitationData: CreateInvitationDto): Promise<InvitationDocument> {
        return await Invitation.create(invitationData);
    }

    async findById(id: string): Promise<InvitationDocument | null> {
        return await Invitation.findById(id);
    }

    async findByToken(token: string): Promise<InvitationDocument | null> {
        return await Invitation.findOne({ token });
    }

    async findPendingInvitation(workspaceId: string, email: string): Promise<InvitationDocument | null> {
        return await Invitation.findOne({ workspaceId, email, status: InvitationStatus.PENDING });
    }

    async findByWorkspace(workspaceId: string): Promise<InvitationDocument[]> {
        return await Invitation.find({ workspaceId });
    }

    async update(invitationId: string, payload: updateInvitationDto, session?: ClientSession): Promise<InvitationDocument | null> {
        return await Invitation.findByIdAndUpdate(
            invitationId,
            payload,
            {
                new: true,
                runValidators: true,
                session
            }
        )
    }
}

export const invitationRepository = new InvitationRepository();