import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authMiddleware } from "./middleware/authMiddleware";
import productRouter from "./routes/products";
import cartRouter from "./routes/carts";
import authRouter from "./routes/auth";
// Load environment variables
dotenv.config();

// Explicitly type the app variable with Application from express
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Add improved CORS configuration
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
  "https://kota-store.vercel.app", // Your future Vercel domain
  "*", // For initial testing only, remove this in production
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) === -1 &&
        allowedOrigins.indexOf("*") === -1
      ) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint (public)
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/", authRouter);
app.use("/products", productRouter); // No auth middleware = public access
app.use("/cart", authMiddleware, cartRouter); // Protected with auth middleware

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Resource not found",
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kota API running on http://localhost:${PORT}`);
});

export default app;
