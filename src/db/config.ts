import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,  // I modified this to true to match SSMS "Mandatory" encryption
    trustServerCertificate: true,
  },
  pool: {  // I added this to help with connection management, especially under load
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const pool = new sql.ConnectionPool(config);

const poolConnect = pool
  .connect()
  .then(() => {
    console.log('MSSQL connection established successfully!');
    return pool;
  })
  .catch((err) => {
    console.error('MSSQL connection failed:', err.message);
    throw err;
  });

pool.on("error", (err) => {
  console.error("SQL pool error:", err);
});

export async function getPool() {
  await poolConnect;
  return pool;
}

export { sql, pool, poolConnect };