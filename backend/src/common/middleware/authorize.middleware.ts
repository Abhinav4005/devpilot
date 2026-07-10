import { Request, Response, NextFunction} from "express";
import { UserRole } from "../../modules/user/user.enum.js";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../constants/http-status.constants.js";

export const authorize = (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction): void => {
    if(!req.user) {
        throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED)
    }

    if(!roles.includes(req.user.role)){
        throw new AppError("You are not authorize to access this resource", HTTP_STATUS.FORBIDDEN);
    }

    next();
}