import express from "express";
import { routes } from "./routes";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

export { app };
