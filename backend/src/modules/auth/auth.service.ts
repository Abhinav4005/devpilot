import { AppError } from "../../common/errors/AppError.js";
import { CreateUserDto, LoginDto, RegisterDto } from "./auth.types.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import bcrypt from "bcryptjs";
import { tokenService } from "../../common/services/token.service.js";
import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";

export class AuthService {
    async register(data: RegisterDto) {
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new AppError("User already exist", 409);
        }

        if (data.username) {
            const existingUsername = await authRepository.findByUsername(data.username);

            if (existingUsername) {
                throw new AppError("Username already exist, do try other username", 400);
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUND);

        const payload: CreateUserDto = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        }

        const newUser = await authRepository.createUser(payload);

        return toUserResponse(newUser);
    }

    async login(data: LoginDto) {
        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError("User not found", 400);
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const accessToken = tokenService.generateAccessToken(user._id.toString());
        const refreshToken = tokenService.generateRefreshToken(user._id.toString());

        const hashedRefreshToken = await bcrypt.hash(refreshToken, env.BCRYPT_SALT_ROUND);

        await authRepository.updateRefreshToken(String(user?.id), hashedRefreshToken);

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        }
    }

    async refresh(refreshToken: string) {
        if(!refreshToken){
            throw new AppError("Refresh token is missing", HTTP_STATUS.UNAUTHORIZED)
        }

    }
}

export const authService = new AuthService();