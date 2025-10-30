import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import dotenv from "dotenv";
import helmet from "helmet";
import http from "http";
import session from "express-session";

dotenv.config();

if (!process.env.SESSION_SECRET) {
  console.error("CRITICAL ERROR: SESSION_SECRET environment variable is not set!");
  console.error("Please set SESSION_SECRET to a long, random string.");
  console.error("Generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
