import mongoose from "mongoose";
import { IUser } from "./user.interface.js";
import { UserRole } from "./user.enum.js";

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profileImage: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;