// index.js (Backend - Express 5 compatible)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Paste } from "./Models/Pastbin.js";
import pasteRoutes from "./Route/Pastebin.js";
import { connectDB } from "./config/Database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Allowed frontend origins
const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "https://pastebin3600.vercel.app",
];

// ✅ CORS (single source of truth)
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / curl / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ EXPRESS 5 FIX — DO NOT USE "*"
app.options(/.*/, cors());

// ✅ Body parser
app.use(express.json());

// ✅ Connect database
await connectDB();

// ✅ Health check
app.get("/api/healthz", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(200).json({ ok: dbOk });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Helper (was missing in your file)
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ✅ Optional HTML paste view
app.get("/p/:id", async (req, res) => {
  const { id } = req.params;

  const paste = await Paste.findById(id).lean();
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

// ✅ Start server (Render uses PORT env)
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
