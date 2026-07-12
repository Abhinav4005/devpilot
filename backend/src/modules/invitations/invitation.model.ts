import mongoose from "mongoose";
import { WorkspaceRole } from "../workspace/workspaceMember.enum.js";
import { InvitationStatus } from "./invitation.enum.js";

const invitationSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
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
        type: mongoose.Types.ObjectId,
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
            new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
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
    {unique: true,
        partialFilterExpression: {
            status: "PENDING"
        }
    }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;