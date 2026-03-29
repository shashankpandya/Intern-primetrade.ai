import { NextFunction, Request, Response } from "express";
import { taskService } from "./task.service";
import { ApiError } from "../../middleware/errorHandler";

export const taskController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const task = await taskService.create(req.user.id, req.body);
      res.status(201).json({ message: "Task created", task });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const tasks = await taskService.list(req.user.id, req.user.role);
      res.status(200).json({ message: "Tasks fetched", tasks });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const taskId = String(req.params.id);
      const task = await taskService.getById(
        taskId,
        req.user.id,
        req.user.role,
      );
      res.status(200).json({ message: "Task fetched", task });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const taskId = String(req.params.id);
      const task = await taskService.update(
        taskId,
        req.user.id,
        req.user.role,
        req.body,
      );
      res.status(200).json({ message: "Task updated", task });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const taskId = String(req.params.id);
      await taskService.remove(taskId, req.user.id, req.user.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
