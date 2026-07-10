import { AppError } from "../../common/errors/AppError.js";
import { CreateUserDto, LoginDto, RegisterDto } from "./auth.types.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import bcrypt from "bcryptjs";
import { tokenService } from "../../common/services/token.service.js";
import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";
import { userRepository } from "../user/user.repository.js";

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

        const tokens = await this.generateAccessTokens(user._id.toString());

        return {
            user: toUserResponse(user),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new AppError("Refresh token is missing", HTTP_STATUS.UNAUTHORIZED)
        }

        const payload = tokenService.verifyRefreshToken(refreshToken);

        const user = await userRepository.findById(payload.sub);

        if (!user) {
            throw new AppError("User not found", HTTP_STATUS.UNAUTHORIZED);
        };

        if (!user.refreshToken) {
            throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED)
        };

        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenValid) {
            throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED)
        };

        const tokens = await this.generateAccessTokens(user._id.toString());

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
    }

    private async generateAccessTokens(userId: string) {
        const accessToken = tokenService.generateAccessToken(userId);
        const refreshToken = tokenService.generateRefreshToken(userId);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, env.BCRYPT_SALT_ROUND);

        await authRepository.updateRefreshToken(userId, hashedRefreshToken);

        return { accessToken, refreshToken }
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw new AppError("Failed to logout", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = tokenService.verifyRefreshToken(refreshToken);

        const user = await userRepository.findById(payload.sub);

        if (!user) {
            throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED);
        }

        if (!user.refreshToken) {
            throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED);
        }

        const isRefreshTokenIsValid = await bcrypt.compare(refreshToken, user.refreshToken!);

        if (!isRefreshTokenIsValid) {
            throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED)
        }

        await authRepository.removeRefreshToken(user._id.toString());
    }
}

export const authService = new AuthService();