import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { tokenService } from "../services/token.service.js";
import { userRepository } from "../../modules/user/user.repository.js";
import { HTTP_STATUS } from "../constants/http-status.constants.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

        const cookieToken = req.cookies?.accessToken;

        const token = bearerToken || cookieToken;

        if (!token) {
            throw new AppError("Token is missing", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = tokenService.verifyAccessToken(token);

        const user = await userRepository.findById(payload.sub);

        if (!user) {
            throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}