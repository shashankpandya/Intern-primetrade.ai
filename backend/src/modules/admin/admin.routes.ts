import { Router } from "express";
import { prisma } from "../../config/prisma";

const router = Router();

router.get("/stats", async (_req, res, next) => {
  try {
    const [users, tasks, completedTasks] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.task.count({ where: { completed: true } }),
    ]);

    res.status(200).json({
      message: "Admin stats fetched",
      stats: {
        users,
        tasks,
        completedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
