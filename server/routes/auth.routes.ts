import { Router } from "express";
import passport from "passport";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { logout } from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
	try {
		const user = await storage.createUser(req.body);
		req.logIn(user, (err) => {
			if (err) return next(err);
			res.status(201).json(user);
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

// POST /api/auth/login
router.post("/login", passport.authenticate("local"), (req, res) => {
	res.json(req.user);
});

// GET /api/auth/github - The route the user clicks to initiate GitHub login
router.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

// GET /api/auth/github/callback - The route GitHub redirects back to
router.get(
	"/github/callback",
	passport.authenticate("github", {
		successRedirect: "/dashboard",
		failureRedirect: "/login",
	})
);

// GET /api/auth/user - Get the currently authenticated user
router.get("/user", isAuthenticated, (req, res) => {
	res.json(req.user);
});

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
