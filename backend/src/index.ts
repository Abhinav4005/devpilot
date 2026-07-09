import express from "express";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.route.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import { connectDB } from "./database/database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", indexRoutes);

app.use(errorHandler);

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