import { IUser } from "../user/user.interface.js";

export const toUserResponse = (user: IUser) => {
    return {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
    };
}