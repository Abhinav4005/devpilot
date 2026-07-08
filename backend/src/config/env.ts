import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV:z
        .enum(["development", "production", "test"])
        .default("development"),

    PORT: z.coerce.number().default(8000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_ACCESS_SECRET: z
        .string()
        .min(1, "JWT_ACCESS_SECRET is required"),
    JWT_REFRESH_SECRET: z
        .string()
        .min(1, "JWT_REFRESH_SECRET is required"),
    ACCESS_TOKEN_EXPIRES_IN: z
        .string()
        .default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z
        .string()
        .default("7d")
});

const parse = envSchema.safeParse(process.env);

if(!parse.success){
    console.error("Invalid environment variables:", parse.error.flatten().fieldErrors);
    process.exit(1)
}

export const env = parse.data;