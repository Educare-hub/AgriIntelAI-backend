import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

let pool: sql.ConnectionPool | null = null;

const dbConfig: sql.config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true, // ✅ allows local dev
  },
};

export async function initDB(): Promise<sql.ConnectionPool> {
  try {
    if (pool) return pool;

    pool = await sql.connect(dbConfig);
    console.log("Connected to MSSQL Database");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export { sql };
