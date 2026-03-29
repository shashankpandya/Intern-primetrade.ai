import { Router } from "express";
import { taskController } from "./task.controller";
import { validate } from "../../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "./task.schema";

const router = Router();

router.get("/", taskController.list);
router.get("/:id", taskController.getById);
router.post("/", validate(createTaskSchema), taskController.create);
router.patch("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.remove);

export default router;
