import mongoose from "mongoose";
import { CreateWorkspaceDto } from "./workspace.types.js";
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
            throw new AppError("Slug is already present", HTTP_STATUS.CONFLICT);
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

            if (!workspace) {
                throw new AppError("Failed to create workspace", HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

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
}

export const workspaceService = new WorkspaceService();