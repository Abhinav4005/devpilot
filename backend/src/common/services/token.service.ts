import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js"
import jwt from "jsonwebtoken";
import { JWTPayload } from "./token.types.js";
import { HTTP_STATUS } from "../constants/http-status.constants.js";

export class TokenService {
    generateAccessToken = (userId: string) => {
        if(!userId){
            throw new AppError("UserId is missing", HTTP_STATUS.UNAUTHORIZED);
        }

        const token = jwt.sign({sub: userId }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

        return token;
    }

    generateRefreshToken = (userId: string) => {
        if(!userId){
            throw new AppError("UserId is missing", HTTP_STATUS.UNAUTHORIZED);
        }

        const token = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

        return token;
    }

    verifyAccessToken = (token: string) => {
        if(!token){
            throw new AppError("Token is missing", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

        return payload as JWTPayload;
    }


    verifyRefreshToken = (token: string) => {
        if(!token){
            throw new AppError("Token is missing", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);

        return payload as JWTPayload;
    }
}

export const tokenService = new TokenService();