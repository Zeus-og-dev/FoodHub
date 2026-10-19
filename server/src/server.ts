import "dotenv/config";
import { app } from "./app.js";
import { pool } from "./db/pool.js";

const port = Number(process.env.PORT ?? 4000);

async function startServer() {
  await pool.query("SELECT 1");

  const server = app.listen(port, () => {
    console.log(`FoodHub API running on http://localhost:${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      void pool.end().finally(() => {
        process.exit(0);
      });
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Failed to start FoodHub API:", error);
  process.exit(1);
});