import { UserRole } from "../user/user.enum.js";
import { IUser } from "../user/user.interface.js";

export interface RegisterDto {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface CreateUserDto {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export interface UserResponseDto {
    id: string;
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
}

export type LoginDto = Pick<
    IUser,
    "email" | "password"
>