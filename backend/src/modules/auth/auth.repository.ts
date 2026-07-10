import User from "../user/user.model.js";
import { CreateUserDto } from "./auth.types.js";
import { UserDocument } from "../user/user.interface.js";

export class AuthRepository {
    async findByEmail(email: string): Promise<UserDocument | null> {
        return await User.findOne({ email }).select("+password");
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return await User.findOne({ username });
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return User.findById(userId).select("+password +refreshToken");
    }

    async createUser(userData: CreateUserDto): Promise<UserDocument> {
        return await User.create(userData);
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<UserDocument | null> {
        return await User.findByIdAndUpdate(userId, {
            refreshToken
        }, { new: true} );
    }

    async removeRefreshToken(userId: string): Promise<UserDocument | null> {
        return await User.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true
            }
        );
    }
}

export const authRepository = new AuthRepository();