import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

export const Validate = (schema: z.ZodTypeAny): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if(!result.success){
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return next(
                new AppError("Validation Failed", 400, errors)
            );
        }

        req.body = (result.data as any).body;
        // req.params = result.data.params;
        // req.query = result.data.query;

        next();
    }
}