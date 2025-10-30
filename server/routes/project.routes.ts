import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
} from "../controllers/project.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
