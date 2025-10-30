import { Request, Response } from "express";
import { storage } from "../storage";

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const project = await storage.createProject(userId, req.body);

    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const projects = await storage.getUserProjects(userId);
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const project = await storage.getProjectById(req.params.id);
  if (!project || project.userId !== userId) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};
