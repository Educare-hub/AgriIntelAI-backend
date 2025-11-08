import express from "express";
const router = express.Router();

// Test endpoint
router.get("/", (req, res) => {
  res.send("Analyze route working fine!");
});

export default router; // default export — required for dynamic import
