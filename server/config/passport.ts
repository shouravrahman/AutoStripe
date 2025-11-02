import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

export const configurePassport = () => {
	// Local Strategy for email/password login
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			async (email, password, done) => {
				try {
					const user = await storage.getUserByEmail(email);
					if (!user) {
						return done(null, false, {
							message: "Incorrect email.",
						});
					}
					const isMatch = await bcrypt.compare(
						password,
						user.password
					);
					if (!isMatch) {
						return done(null, false, {
							message: "Incorrect password.",
						});
					}
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	// GitHub Strategy for social login
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID!,
				clientSecret: process.env.GITHUB_CLIENT_SECRET!,
				callbackURL: "/api/auth/github/callback",
				scope: ["user:email"], // Important to get the user's email
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const email = profile.emails?.[0]?.value;
					if (!email) {
						return done(
							new Error("GitHub profile missing email."),
							undefined
						);
					}

					let user = await storage.getUserByEmail(email);
					if (!user) {
						// If user doesn't exist, create a new one
						user = await storage.createUser({
							name: profile.displayName,
							email: email,
							provider: "github",
							providerId: profile.id,
						});
					}
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	passport.serializeUser((user: any, done) => done(null, user.id));
	passport.deserializeUser(async (id: string, done) => {
		try {
			const user = await storage.getUser(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
};
