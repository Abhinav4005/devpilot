import { UserDocument } from "../../modules/user/user.interface.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument
        }
    }
}

export {};