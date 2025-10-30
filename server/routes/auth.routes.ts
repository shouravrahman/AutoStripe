import { Router } from "express";
import { signup, login, logout, getUser } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", isAuthenticated, getUser);

export default router;
