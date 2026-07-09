import { UserResponseDto } from "./auth.types.js";
import { UserDocument } from "../user/user.interface.js";

export const toUserResponse = (user: UserDocument): UserResponseDto => {
    return {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
    };
}