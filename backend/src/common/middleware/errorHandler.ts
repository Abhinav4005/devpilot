import {Request, Response, NextFunction} from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            statusCode: error.statusCode,
            errors: error.errors ?? null
        })
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}