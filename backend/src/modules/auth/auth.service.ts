import { AppError } from "../../common/errors/AppError.js";
import { CreateUserDto, RegisterDto } from "./auth.types.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import bcrypt from "bcryptjs";

export class AuthService {
    async register (data: RegisterDto) {
        const existingUser = await authRepository.findByEmail(data.email);

        if(existingUser){
            throw new AppError("User already exist", 400);
        }

        const existingUsername = await authRepository.findByUsername(data.username);

        if(existingUsername){
            throw new AppError("Username already exist, do try other username", 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

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
}

export const authService = new AuthService();