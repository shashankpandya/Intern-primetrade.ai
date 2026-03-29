import { prisma } from "../../config/prisma";
import { ApiError } from "../../middleware/errorHandler";

type UserRole = "USER" | "ADMIN";

type TaskPayload = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export const taskService = {
  async create(
    userId: string,
    payload: Required<Pick<TaskPayload, "title">> & TaskPayload,
  ) {
    return prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        completed: payload.completed ?? false,
        userId,
      },
    });
  },

  async list(userId: string, role: UserRole) {
    if (role === "ADMIN") {
      return prisma.task.findMany({
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string, userId: string, role: UserRole) {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (role !== "ADMIN" && task.userId !== userId) {
      throw new ApiError(403, "Forbidden");
    }

    return task;
  },

  async update(
    id: string,
    userId: string,
    role: UserRole,
    payload: TaskPayload,
  ) {
    await this.getById(id, userId, role);

    return prisma.task.update({
      where: { id },
      data: payload,
    });
  },

  async remove(id: string, userId: string, role: UserRole) {
    await this.getById(id, userId, role);
    await prisma.task.delete({ where: { id } });
  },
};
