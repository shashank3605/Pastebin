import { Paste } from "../Models/Pastbin.js";

function getNowMs(req) {
  const testMode = process.env.TEST_MODE === "1";
  const header = req.header("x-test-now-ms");
  if (testMode && header) {
    const n = Number(header);
    if (Number.isFinite(n)) return n;
  }
  return Date.now();
}

export const PastebinGet = async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date(getNowMs(req));

    // 1) Limited paste: decrement view count atomically
    const limited = await Paste.findOneAndUpdate(
      {
        _id: id,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        remainingViews: { $ne: null, $gt: 0 },
      },
      { $inc: { remainingViews: -1 } },
      { new: true }
    )
      .select("content remainingViews expiresAt")
      .lean();

    if (limited) {
      // If this fetch consumed the last view, delete after serving it
      if (limited.remainingViews === 0) {
        Paste.deleteOne({ _id: id }).catch(() => {});
      }

      return res.status(200).json({
        content: limited.content,
        remaining_views: limited.remainingViews,
        expires_at: limited.expiresAt
          ? new Date(limited.expiresAt).toISOString()
          : null,
      });
    }

    // 2) Unlimited paste: return if exists and not expired
    const unlimited = await Paste.findOne({
      _id: id,
      remainingViews: null,
    })
      .select("content expiresAt")
      .lean();

    if (!unlimited) {
      return res.status(404).json({ error: "Not found" });
    }

    // Expired => delete + 404
    if (unlimited.expiresAt && new Date(unlimited.expiresAt) <= now) {
      Paste.deleteOne({ _id: id }).catch(() => {});
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({
      content: unlimited.content,
      remaining_views: null,
      expires_at: unlimited.expiresAt
        ? new Date(unlimited.expiresAt).toISOString()
        : null,
    });
  } catch (err) {
    console.error("Fetch paste error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
