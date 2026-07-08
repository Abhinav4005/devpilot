import { Document } from "mongoose";
import { UserRole } from "./user.enum.js";

export interface IUser extends Document {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImage?: string;
    refreshToken?: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;

    deletedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
}