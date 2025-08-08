import { Request, Response, NextFunction } from "express";

// Extend the Request type to include user information
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify authentication tokens and protect routes
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        error: "Invalid token format",
      });
    }

    // In a real application, we would verify the token here
    // For FakeStore API, we'll just check if a token is present
    // and attach it to the request for future use
    req.user = { token };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      error: "Invalid token",
    });
  }
};