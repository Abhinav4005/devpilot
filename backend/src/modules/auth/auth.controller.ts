import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { ApiResponse } from "../../common/responses/ApiResponse.js";

export class AuthController {
    register = async (req: Request, res: Response): Promise<void> =>  {
        const user = await authService.register(req.body);

        res.status(201).json(
            new ApiResponse(
                201,
                user,
                "User created successfully",
            )
        )
    }
}

export const authController = new AuthController();