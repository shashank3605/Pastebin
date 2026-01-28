import crypto from "crypto";
import { Paste } from "../Models/Pastbin.js";

function parseOptionalPositiveInt(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(String(v).trim());
  if (!Number.isInteger(n) || n < 1) return NaN;
  return n;
}

export const PastebinPost = async (req, res) => {
  try {
    const { content } = req.body;

    // content: required, non-empty string
    if (typeof content !== "string" || content.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "content must be a non-empty string" });
    }

    const ttlSeconds = parseOptionalPositiveInt(req.body.ttl_seconds);
    if (Number.isNaN(ttlSeconds)) {
      return res
        .status(400)
        .json({ error: "ttl_seconds must be an integer ≥ 1" });
    }

    const maxViews = parseOptionalPositiveInt(req.body.max_views);
    if (Number.isNaN(maxViews)) {
      return res
        .status(400)
        .json({ error: "max_views must be an integer ≥ 1" });
    }

    const id = crypto.randomBytes(6).toString("hex");
    const now = Date.now();

    const expiresAt =
      ttlSeconds !== undefined ? new Date(now + ttlSeconds * 1000) : null;
    const remainingViews = maxViews !== undefined ? maxViews : null;

    await Paste.create({ _id: id, content, expiresAt, remainingViews });

    // Prefer a public base URL if provided (useful for vercel)
    const base =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;

    const url = `${base}/p/${id}`;

    return res.status(201).json({ id, url });
  } catch (err) {
    console.error("Create paste error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
