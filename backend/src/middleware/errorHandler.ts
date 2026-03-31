import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      message:
        "Database connection unavailable. Check DATABASE_URL, Supabase status, and network access.",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Requested resource not found" });
    }

    return res.status(400).json({ message: "Database request failed" });
  }

  console.error(err);

  return res.status(500).json({ message: "Internal server error" });
};
