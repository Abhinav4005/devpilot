import { WorkspaceMemberDocument } from "./workspaceMember.interface.js";
import WorkspaceMember from "./workspaceMember.model.js";
import { createWorkspaceMemberDto } from "./workspaceMember.type.js";

export class WorkspaceMemberRepository {
    async createWorkspaceMember(userData: createWorkspaceMemberDto): Promise<WorkspaceMemberDocument | null> {
        return await WorkspaceMember.create(userData);
    }
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();