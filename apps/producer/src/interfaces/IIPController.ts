import { Request, Response } from "express";

export interface IIPController {
  handle(req: Request, res: Response): void;
}
