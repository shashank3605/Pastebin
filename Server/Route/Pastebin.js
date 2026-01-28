import express from "express";
import { PastebinGet } from "../Controller/PastebinGet.js";
import { PastebinPost } from "../Controller/PastebinPost.js";

const router = express.Router();

// POST /api/pastes
router.post("/pastes", PastebinPost);

// GET /api/pastes/:id
router.get("/pastes/:id", PastebinGet);

export default router;
