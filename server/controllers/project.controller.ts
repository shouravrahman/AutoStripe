import { Request, Response } from "express";
import { storage } from "../storage";

// GET /api/projects - Fetch all projects for the logged-in user
export const getProjects = async (req: any, res: Response) => {
	try {
		const projects = await storage.getUserProjects(req.user.id);
		res.json(projects);
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// GET /api/projects/:id - Fetch a single project by ID
export const getProjectById = async (req: any, res: Response) => {
	const { id } = req.params;
	try {
		const project = await storage.getProjectById(id);

		if (!project || project.userId.toString() !== req.user.id) {
			return res.status(404).json({ message: "Project not found" });
		}
		res.json(project);
	} catch (error) {
		console.error(`Failed to fetch project ${id}:`, error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// POST /api/projects - Create a new project
export const createProject = async (req: any, res: Response) => {
	const { name } = req.body;

	if (!name || typeof name !== "string" || name.trim().length === 0) {
		return res.status(400).json({ message: "Project name is required" });
	}

	try {
		const user = await storage.getUser(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.subscriptionStatus === "free") {
			const userProjects = await storage.getUserProjects(req.user.id);
			if (userProjects.length >= 3) {
				return res.status(403).json({
					message: "Free plan users are limited to 3 projects. Please upgrade to create more.",
				});
			}
		}

		const project = await storage.createProject(req.user.id, {
			name: name.trim(),
		});
		res.status(201).json(project);
	} catch (error) {
		console.error("Failed to create project:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
		const project = await storage.getProjectById(id);

		if (!project || project.userId.toString() !== req.user.id) {
			return res.status(404).json({ message: "Project not found" });
		}

		await storage.deleteProject(id);
		res.status(204).send();
  } catch (error) {
		console.error(`Failed to delete project ${id}:`, error);
		res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/projects/:id - Update a project
export const updateProject = async (req: any, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const project = await storage.getProjectById(id);

    if (!project || project.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await storage.updateProject(id, updates);
    res.json(updatedProject);
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};
