import { ClientSession } from "mongoose";
import { WorkspaceMemberDocument } from "./workspaceMember.interface.js";
import WorkspaceMember from "./workspaceMember.model.js";
import { CreateWorkspaceMemberDto } from "./workspaceMember.type.js";

export class WorkspaceMemberRepository {
    async create(data: CreateWorkspaceMemberDto, session: ClientSession): Promise<WorkspaceMemberDocument> {
        const [member] = await WorkspaceMember.create([data], { session });
        return member;
    }
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();