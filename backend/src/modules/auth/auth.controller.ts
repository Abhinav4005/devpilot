import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { ApiResponse } from "../../common/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";

export class AuthController {
    register = async (req: Request, res: Response): Promise<void> =>  {
        const user = await authService.register(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                user,
                "User created successfully",
            )
        )
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const { user, accessToken, refreshToken} = await authService.login(req.body);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 15 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        })

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                user,
                "User logged in successfully"
            )
        )
    }

    me = async (req:Request, res: Response):Promise<void> => {
        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                req.user,
                "Current user fetched successfully"
            )
        )
    }

    refresh = async(req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.refreshToken;
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                null,
                "Access Token refreshed successfully"
            )
        );
    }

    logout = async(req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.refreshToken;
        await authService.logout(refreshToken);
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite:"lax",
            maxAge: 15 * 24 * 60 *1000
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 *1000
        });

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                null,
                "Logged out successfully"
            )
        )
    }
}

export const authController = new AuthController();