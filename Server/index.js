// index.js (Backend - Express)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Paste } from "./Models/Pastbin.js";
import pasteRoutes from "./Route/Pastebin.js";
import { connectDB } from "./config/Database.js";

// If you use escapeHtml in /p/:id, keep this helper.
// If you already have it elsewhere, remove this duplicate.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow your local + Vercel frontend origins
const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "https://pastebin3600.vercel.app",
];

// ✅ CORS (single, correct config)
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl/postman/server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// ✅ Connect DB
await connectDB();

// ✅ Health check
app.get("/api/healthz", async (req, res) => {
  try {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(200).json({ ok: dbOk });
  } catch {
    res.status(200).json({ ok: false });
  }
});

// ✅ Root route (so / doesn't show "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Optional: simple HTML view of a paste
app.get("/p/:id", async (req, res) => {
  const { id } = req.params;

  const paste = await Paste.findOne({ _id: id }).lean();
  if (!paste) return res.status(404).send("Not Found");

  res.status(200).send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Paste ${id}</title>
      </head>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

// ✅ API routes
app.use("/api", pasteRoutes);

// ✅ Start server (Render uses process.env.PORT)
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
