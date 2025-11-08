// src/controllers/authController.ts
import { Request, Response } from "express";
import { getPool, sql } from "../db/config";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, phone, password } = req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getPool();

    await pool.request()
      .input("fullName", sql.NVarChar(100), fullName)
      .input("phone", sql.NVarChar(20), phone)
      .input("password", sql.NVarChar(255), hashedPassword)
      .query(`
        INSERT INTO users (fullName, phone, password)
        VALUES (@fullName, @phone, @password)
      `);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error("DB register error:", err);
    res.status(500).json({
      error: "Failed to register user",
      details: err.message || "Unknown error",
    });
  }
};
