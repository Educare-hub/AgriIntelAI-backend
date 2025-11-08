import express from "express";
import { registerUser } from "../controllers/authController"; 

const router = express.Router();

router.post("/register", registerUser);

router.get("/", (req, res) => {
  res.send("Auth route working fine!");
});

export default router;
