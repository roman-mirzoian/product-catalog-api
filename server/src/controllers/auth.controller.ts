import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json(result);
}

export async function meHandler(req: Request, res: Response) {
  res.json({ user: req.user });
}
