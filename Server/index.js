import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { Paste } from "./Models/Pastbin.js";
import pasteRoutes from "./Route/Pastebin.js";
import { connectDB } from "./config/Database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4000", "https://pastebin-20pv.onrender.com"],
  })
);

// app.use(cors({ origin: "http://localhost:4000" }));

app.get("/api/healthz", async (req, res) => {
  try {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(200).json({ ok: dbOk });
  } catch {
    res.status(200).json({ ok: false });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.get("/p/:id", async (req, res) => {
  const { id } = req.params;

  const paste = await Paste.findOne({ _id: id }).lean();
  if (!paste) {
    return res.status(404).send("Not Found");
  }

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

app.use("/api", pasteRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
