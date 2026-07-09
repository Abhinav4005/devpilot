import { HydratedDocument } from "mongoose";
import { UserRole } from "./user.enum.js";

export interface IUser {
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

export type UserDocument = HydratedDocument<IUser>;