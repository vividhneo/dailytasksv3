import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tasks/:profileId", async (req, res) => {
    const profileId = parseInt(req.params.profileId);
    const tasks = await storage.getTasks(profileId);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const parsed = insertTaskSchema.parse(req.body);
    const task = await storage.createTask(parsed);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = insertTaskSchema.partial().parse(req.body);
    const task = await storage.updateTask(id, updates);
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).end();
  });

  app.get("/api/profiles", async (_req, res) => {
    const profiles = await storage.getProfiles();
    res.json(profiles);
  });

  app.post("/api/profiles", async (req, res) => {
    const parsed = insertProfileSchema.parse(req.body);
    const profile = await storage.createProfile(parsed);
    res.json(profile);
  });

  app.delete("/api/profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProfile(id);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
