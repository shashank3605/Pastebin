import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    remainingViews: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  {
    versionKey: false,
  }
);

// TTL index (auto-delete when expiresAt is reached)
PasteSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { expiresAt: { $type: "date" } },
  }
);

export const Paste =
  mongoose.models.Paste || mongoose.model("Paste", PasteSchema);
