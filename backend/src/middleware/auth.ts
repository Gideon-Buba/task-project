import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";

export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send({ error: "Authentication required" });
    return; // Explicitly return nothing (void)
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded; // Consider defining a custom Request type for better type safety
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
    return; // Explicitly return nothing (void)
  }
};
