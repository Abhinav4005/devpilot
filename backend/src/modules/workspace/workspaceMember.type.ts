import { z } from "zod";
import { workspaceMemberSchema } from "./workspaceMember.validation.js";

export type createWorkspaceMemberDto = z.infer<typeof workspaceMemberSchema>["body"];