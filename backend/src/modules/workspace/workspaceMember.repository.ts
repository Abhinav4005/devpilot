import { ClientSession } from "mongoose";
import { WorkspaceMemberDocument } from "./workspaceMember.interface.js";
import WorkspaceMember from "./workspaceMember.model.js";
import { CreateWorkspaceMemberDto } from "./workspaceMember.types.js";

export class WorkspaceMemberRepository {
    async create(data: CreateWorkspaceMemberDto, session?: ClientSession): Promise<WorkspaceMemberDocument> {
        const [member] = await WorkspaceMember.create([data], { session });
        return member;
    }

    async findMember(workspaceId: string, userId: string): Promise<WorkspaceMemberDocument | null> {
        return await WorkspaceMember.findOne({ workspaceId, userId });
    }
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();