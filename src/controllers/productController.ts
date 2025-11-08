// src/controllers/productController.ts
import { Request, Response } from "express"; 
import { getPool, sql } from "../db/config";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Dual-compatible addProduct
export const addProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity } = req.body;

  // Validation: either description (old) or quantity (new) must exist
  if (!name || price == null || (quantity == null && description == null)) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  try {
    const pool = await getPool();

    // Check which fields exist
    if (quantity != null) {
      // Frontend version
      await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("price", sql.Decimal(10, 2), price)
        .input("quantity", sql.Int, quantity)
        .query(
          "INSERT INTO Products (name, price, quantity) VALUES (@name, @price, @quantity)"
        );
      res.status(201).json({ name, price, quantity });
    } else {
      // Old test version
      await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("description", sql.NVarChar, description)
        .input("price", sql.Decimal(10, 2), price)
        .query(
          "INSERT INTO Products (name, description, price) VALUES (@name, @description, @price)"
        );
      res.status(201).json({ name, description, price });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};
