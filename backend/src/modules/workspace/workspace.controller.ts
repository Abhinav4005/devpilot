import { Request, Response } from "express";
import { workspaceService } from "./workspace.service.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";
import { ApiResponse } from "../../common/responses/ApiResponse.js";

export class WorkspaceController {
    create = async (req: Request, res: Response): Promise<void> => {
        const workspace = await workspaceService.create(req.body, req.user!._id.toString());

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                workspace,
                "Workspace created successfully"
            )
        )
    }
}