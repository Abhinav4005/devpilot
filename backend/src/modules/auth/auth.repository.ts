import User from "../user/user.model.js";
import { CreateUserDto } from "./auth.types.js";

export class AuthRepository {
    async findByEmail(email: string){
        return await User.findOne({ email });
    }

    async findByUsername(username: string){
        return await User.findOne({ username });
    }

    async findById(userId: string){
        return await User.findOne({ _id: userId })
    }

    async createUser(userData: CreateUserDto){
        return await User.create(userData)
    }

    async updateRefreshToken(userId: string, refreshToken: string){
        return await User.findByIdAndUpdate(userId, {
            refreshToken
        }, { new: true} )
    }

    async removeRefreshToken(userId: string){
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