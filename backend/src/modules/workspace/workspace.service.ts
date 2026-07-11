import mongoose from "mongoose";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./workspace.types.js";
import { workspaceRepository } from "./workspace.repository.js";
import { workspaceMemberRepository } from "./workspaceMember.repository.js";
import { WorkspaceRole } from "./workspaceMember.enum.js";
import { AppError } from "../../common/errors/AppError.js";
import { HTTP_STATUS } from "../../common/constants/http-status.constants.js";
import { toWorkspaceResponse } from "./workspace.mapper.js";
import { generateSlug } from "../../common/utils/slug.util.js";

export class WorkspaceService {
    async create(data: CreateWorkspaceDto, ownerId: string) {
        const slug = generateSlug(data.name);

        const existing = await workspaceRepository.findBySlug(slug);

        if (existing) {
            throw new AppError("Workspace with this name already exists", HTTP_STATUS.CONFLICT);
        }

        const session = await mongoose.startSession();

        session.startTransaction();

        try {
            const payload = {
                ...data,
                slug,
                owner: ownerId,
            }
            const workspace = await workspaceRepository.create(payload, session);

            await workspaceMemberRepository.create(
                {
                    workspaceId: workspace._id,
                    userId: ownerId,
                    role: WorkspaceRole.OWNER,
                },
                session
            );

            await session.commitTransaction();

            return toWorkspaceResponse(workspace);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async getMyWorkspaces(ownerId: string) {
        const workspaceData = await workspaceRepository.findByOwner(ownerId);

        return workspaceData.map(toWorkspaceResponse);
    }

    async getById(workspaceId: string) {
        const workspaceData = await workspaceRepository.findById(workspaceId);

        if (!workspaceData) {
            throw new AppError("Workspace not found", HTTP_STATUS.NOT_FOUND);
        }

        return toWorkspaceResponse(workspaceData);
    }

    async update(workspaceId: string, ownerId: string, workspaceData: UpdateWorkspaceDto) {
        await this.validateWorkspaceOwner(workspaceId, ownerId);

        const updatedData = await workspaceRepository.update(workspaceId, workspaceData);

        if (!updatedData) {
            throw new AppError("Failed to update workspace", HTTP_STATUS.BAD_REQUEST);
        }

        return toWorkspaceResponse(updatedData);
    }

    async archive(workspaceId: string, ownerId: string) {
        await this.validateWorkspaceOwner(workspaceId, ownerId);

        const updateArchive = await workspaceRepository.archive(workspaceId);

        if (!updateArchive) {
            throw new AppError("Failed to update archive", HTTP_STATUS.BAD_REQUEST);
        }

        return toWorkspaceResponse(updateArchive);
    }

    async unarchive(workspaceId: string, ownerId: string) {

        await this.validateWorkspaceOwner(workspaceId, ownerId);

        const updateArchive = await workspaceRepository.unarchive(workspaceId);

        if (!updateArchive) {
            throw new AppError("Failed to update archive", HTTP_STATUS.BAD_REQUEST);
        }

        return toWorkspaceResponse(updateArchive);
    }

    private async validateWorkspaceOwner(workspaceId: string, ownerId: string) {
        const workspace = await workspaceRepository.findById(workspaceId);

        if (!workspace) {
            throw new AppError("Workspace not found", HTTP_STATUS.NOT_FOUND);
        }

        if (workspace.owner.toString() !== ownerId) {
            throw new AppError("You are not authorized to access this workspace", HTTP_STATUS.FORBIDDEN);
        }

        return workspace;
    }
}

export const workspaceService = new WorkspaceService();