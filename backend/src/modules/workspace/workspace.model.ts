import mongoose, { Mongoose } from "mongoose";
import { IWorkspace } from "./workspace.interface.js";
import { WorkspaceVisibility } from "./workspace.enum.js";

const workspaceSchema = new mongoose.Schema<IWorkspace>({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    logo: {
        type: String,
        default: null,
    },
    visibility: {
        type: String,
        enum: Object.values(WorkspaceVisibility),
        default: WorkspaceVisibility.PRIVATE
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;