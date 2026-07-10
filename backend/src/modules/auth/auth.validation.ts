import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string()
            .trim()
            .min(3, "Username is must be at least 3 characters")
            .max(30, "Username cannot exceed 30 characters")
            .optional(),
        firstName: z
            .string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .max(30, "First name cannot exceed 30 characters"),

        lastName: z
            .string()
            .trim()
            .min(2, "Last name must be at least 2 characters")
            .max(30, "Last name cannot exceed 30 characters"),

        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .transform((email) => email.toLowerCase()),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        confirmPassword: z.string(),
    }),
    params: z.object({}),

    query: z.object({})
})
    .refine((data) => data.body.password === data.body.confirmPassword, {
        message: "Password and Confirm Password do not match",
        path: ["confirmPassword"]
    });

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .transform((email) => email.toLowerCase()),
        password: z.string().min(1, "Password is required"),
    }),
    params: z.object({}),
    query: z.object({})
});