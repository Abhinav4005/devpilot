import { WorkspaceDocument } from "./workspace.interface.js";
import { workspaceResponseDto } from "./workspace.types.js";

export const toWorkspaceResponse = (workspace: WorkspaceDocument): workspaceResponseDto => {
    return {
        id: workspace._id.toString(),
        name: workspace.name,
        slug: workspace.slug,
        logo: workspace.logo,
        owner: workspace.owner.toString(),
        visibility: workspace.visibility,
    }
}