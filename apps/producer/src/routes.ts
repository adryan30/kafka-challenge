import { Router } from "express";
import { IPController } from "./controllers/ip.controller";

const ipController = new IPController();
const routes = Router();

routes.get("/health", async (req, res) => {
  return res.json({ ok: true });
});
routes.post("/ip", ipController.handle);

export { routes };
