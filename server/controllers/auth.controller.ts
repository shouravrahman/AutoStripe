import { Request, Response } from "express";
import { storage } from "../storage";
import bcrypt from "bcryptjs";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await storage.createUser({ email, password, name });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in after signup" });
      }
      res.json({ id: user.id, email: user.email, name: user.name });
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = (req: Request, res: Response) => {
  const { id, email, name, role } = req.user;
  res.json({ id, email, name, role });
};

export const logout = (req: Request, res: Response) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ message: "Error logging out" });
    }
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
};

export const getUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id, email, name, role } = req.user;
  res.json({ id, email, name, role });
};
