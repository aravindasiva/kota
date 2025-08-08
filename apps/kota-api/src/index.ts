import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authMiddleware } from "./middleware/authMiddleware";
import productRouter from "./routes/products";
import cartRouter from "./routes/carts";
import authRouter from "./routes/auth";
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/", authRouter);
app.use("/products", productRouter); // No auth middleware = public access
app.use("/cart", authMiddleware, cartRouter); // Protected with auth middleware

// Handle 404
app.use((req, res) => {
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
