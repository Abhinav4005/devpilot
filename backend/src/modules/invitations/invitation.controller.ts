import { Request, Response } from "express";
import { invitationService } from "./invitation.service.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";
import { ApiResponse } from "../../common/responses/ApiResponse.js";

export class InvitationController {
    create = async (req: Request, res: Response): Promise<void> => {
        const workspaceId = req.params.workspaceId as string;
        const invitedBy = req.user!._id.toString();

        const result = await invitationService.create(workspaceId, invitedBy, req.body);

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                result,
                "Invitation sent successfully"
            )
        );
    };

    accept = async (req: Request, res: Response): Promise<void> => {
        const token = req.params.token as string;
        const userId = req.user!._id.toString();

        const result = await invitationService.accept(token, userId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                result,
                "Invitation accepted successfully"
            )
        );
    };

    reject = async (req: Request, res: Response): Promise<void> => {
        const token = req.params.token as string;
        const userId = req.user!._id.toString();

        const result = await invitationService.reject(token, userId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                result,
                "Invitation rejected successfully"
            )
        );
    };

    cancel = async (req: Request, res: Response): Promise<void> => {
        const invitationId = req.params.invitationId as string;
        const userId = req.user!._id.toString();

        const result = await invitationService.cancel(invitationId, userId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                result,
                "Invitation cancelled successfully"
            )
        );
    };
}

export const invitationController = new InvitationController();