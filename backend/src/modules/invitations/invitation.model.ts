import mongoose from "mongoose";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";
import { InvitationStatus } from "./invitation.enum.js";
import { IInvitation } from "./invitation.interface.js";

const invitationSchema = new mongoose.Schema<IInvitation>({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(WorkspaceRole),
        default: WorkspaceRole.MEMBER
    },
    status: {
        type: String,
        enum: Object.values(InvitationStatus),
        default: InvitationStatus.PENDING
    },
    expiresAt: {
        type: Date,
        default: () => {
            return new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            );
        }
    },
    token: {
        type: String,
        required: true,
    },
    acceptedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    }
}, {
    timestamps: true
});

invitationSchema.index(
    {
        workspaceId: 1,
        email: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "PENDING"
        }
    }
);

invitationSchema.index({
    expiresAt: 1
});

invitationSchema.index({
    token: 1
})

const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema);

export default Invitation;