import express from "express";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.route.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import { connectDB } from "./database/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(errorHandler);

app.use("/api/v1", indexRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`server listening on port: ${PORT}`);
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();