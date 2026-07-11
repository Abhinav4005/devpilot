import mongoose from "mongoose";
import { IWorkspaceMember } from "./workspaceMember.interface.js";
import { WorkspaceRole } from "./workspaceMember.enum.js";

const workspaceMemberSchema = new mongoose.Schema<IWorkspaceMember>({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: Object.values(WorkspaceRole),
        default: WorkspaceRole.ADMIN
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

const WorkspaceMember = mongoose.model<IWorkspaceMember>("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMember