import { NextFunction, Request, Response } from "express";
import { ApiError } from "./errorHandler";

type UserRole = "USER" | "ADMIN";

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }

    return next();
  };
};
