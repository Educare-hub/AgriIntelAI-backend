import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


import authRoutes from "./routes/authRoutes.ts";
import analyzeRoutes from "./routes/analyzeRoutes.ts";
import productsRoutes from "./routes/productRoutes.ts";


app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

export default app;
