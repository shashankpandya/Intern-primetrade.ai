import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import taskRoutes from "../modules/tasks/task.routes";
import adminRoutes from "../modules/admin/admin.routes";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", authenticate, taskRoutes);
router.use("/admin", authenticate, authorize("ADMIN"), adminRoutes);

export default router;
