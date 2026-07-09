import {Request, Response, NextFunction} from "express";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../constants/http-status.constants.js";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            statusCode: error.statusCode,
            errors: error.errors ?? null
        })
    }

    if (error.name === "JsonWebTokenError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token. Please log in again.",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            errors: null
        });
    }

    if (error.name === "TokenExpiredError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Your token has expired. Please log in again.",
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            errors: null
        });
    }

    console.error(error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error"
    })
}