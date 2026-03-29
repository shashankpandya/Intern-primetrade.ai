import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./errorHandler";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as {
      sub: string;
      role: "USER" | "ADMIN";
      email: string;
    };

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
