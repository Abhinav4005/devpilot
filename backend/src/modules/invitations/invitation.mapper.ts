import { InvitationDocument } from "./invitation.interface.js";
import { invitationResponse } from "./invitation.types.js";

export const toInvitationResponse = (invitation: InvitationDocument): invitationResponse => {
    return {
        workspaceId: invitation.workspaceId,
        userId: invitation.userId,
        email: invitation.email,
        invitedBy: invitation.invitedBy,
        role: invitation.role,
        status: invitation.status
    }
}