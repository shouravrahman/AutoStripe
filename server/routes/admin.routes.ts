import { Router } from "express";
import { getUsers, getStats } from "../controllers/admin.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.use(isAuthenticated, isAdmin);

router.get("/users", getUsers);
router.get("/stats", getStats);

export default router;
