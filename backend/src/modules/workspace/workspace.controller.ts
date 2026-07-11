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

    getMyWorkspaces = async (req: Request, res: Response): Promise<void> => {
        const workspace = await workspaceService.getMyWorkspaces(req.user!._id.toString());

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                workspace,
                "Workspace retrived successfully"
            )
        )
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        const workspaceId = req.params.id as string;
        const workspace = await workspaceService.getById(workspaceId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                workspace,
                "Workspace retrived successfully"
            )
        )
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const workspace = await workspaceService.update(req.params.id as string, req.user!._id.toString(), req.body);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                workspace,
                "Workspace updated successfully"
            )
        )
    }

    archive = async (req: Request, res: Response): Promise<void> => {
        const workspace = await workspaceService.archive(req.params.id as string, req.user!._id.toString());

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                workspace,
                "Workspace archived successfully"
            )
        )
    }

    unarchive = async (req: Request, res: Response): Promise<void> => {
        const workspace = await workspaceService.unarchive(req.params.id as string, req.user!._id.toString());

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                workspace,
                "Workspace unarchived successfully"
            )
        )
    }
}

export const workspaceController = new WorkspaceController();