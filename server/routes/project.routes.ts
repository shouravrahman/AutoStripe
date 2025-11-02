import { Router } from "express";
import {
	createProject,
	deleteProject,
	getProjects,
	getProjectById,
	updateProject,
} from "../controllers/project.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
