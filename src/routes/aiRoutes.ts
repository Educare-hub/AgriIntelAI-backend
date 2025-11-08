import express from "express";
import { analyzeFarmData } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeFarmData);

export default router;
