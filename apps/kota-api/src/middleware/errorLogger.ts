import { Request, Response, NextFunction } from "express";

export const errorLogger = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("=== API Error ===");
  console.error(`${req.method} ${req.path}`);
  console.error("Body:", req.body);
  console.error("Error:", error);
  console.error("================");

  next(error);
};
