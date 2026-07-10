import User from "./user.model.js";

export class UserRepository {
    async findById(userId: string) {
        return User.findById(userId).select("+password +refreshToken");
    }
}

export const userRepository = new UserRepository();