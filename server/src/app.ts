import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db/pool.js";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        database: "connected",
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/restaurants", async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 100)
        : "";

    const result = await pool.query(
      `SELECT
         id,
         name,
         slug,
         description,
         cuisine,
         image_url AS "imageUrl",
         rating,
         delivery_time_minutes AS "deliveryTimeMinutes",
         delivery_fee_paise AS "deliveryFeePaise",
         is_open AS "isOpen"
       FROM restaurants
       WHERE ($1 = '' OR name ILIKE '%' || $1 || '%'
                    OR cuisine ILIKE '%' || $1 || '%')
       ORDER BY rating DESC, name ASC
       LIMIT 50`,
      [search],
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("API error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      },
    });
  },
);