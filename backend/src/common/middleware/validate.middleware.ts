import { Request, Response, NextFunction, RequestHandler } from "express";
import { z  } from "zod";
import { AppError } from "../errors/AppError.js";
import { AnyZodObject } from "zod/v3";

type RequestSchema = z.ZodObject<{
    body: z.ZodTypeAny;
    params: z.ZodTypeAny;
    query: z.ZodTypeAny;
}>;

export const Validate = (schema: RequestSchema): RequestHandler => {
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

        req.body = result.data.body;
        // req.params = result.data.params;
        // req.query = result.data.query;

        next();
    }
}