import { ClientSession } from "mongoose";
import { WorkspaceDocument } from "./workspace.interface.js";
import Workspace from "./workspace.model.js";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./workspace.types.js";

export class WorkspaceRepository {
    async create(workspaceData: CreateWorkspaceDto, session: ClientSession): Promise<WorkspaceDocument> {
        const [workspace] = await Workspace.create(
            [
                {
                    ...workspaceData
                }
            ],
            { session }
        );

        return workspace;
    }

    async findBySlug(slug: string): Promise<WorkspaceDocument | null> {
        return await Workspace.findOne({ slug });
    }

    async findById(id: string): Promise<WorkspaceDocument | null> {
        return await Workspace.findById(id);
    }

    async findByOwner(ownerId: string): Promise<WorkspaceDocument[]> {
        return await Workspace.find({ owner: ownerId });
    }

    async update(id: string, payload: UpdateWorkspaceDto): Promise<WorkspaceDocument | null> {
        return await Workspace.findByIdAndUpdate(
            id,
            {
                $set: payload
            },
            {
                new: true,
                runValidators: true,
            }
        )
    }

    async archive(id: string): Promise<WorkspaceDocument | null> {
        return await Workspace.findByIdAndUpdate(
            id,
            {
                isArchived: true,
            },
            {
                new: true,
                runValidators: true,
            }
        )
    }

    async unarchive(id: string): Promise<WorkspaceDocument | null> {
        return await Workspace.findByIdAndUpdate(
            id,
            {
                isArchived: false,
            },
            {
                new: true,
                runValidators: true,
            }
        );
    }
}

export const workspaceRepository = new WorkspaceRepository();