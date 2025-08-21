// api/routes/drills.js
import express from "express";
import Drill from "../models/Drill.js";
import { getCache, setCache } from "../utils/cache.js";

const router = express.Router();

// GET /api/drills
router.get("/", async (req, res, next) => {
  try {
    const cached = getCache("drills_list");
    if (cached) return res.json(cached);

    const drills = await Drill.find({}, { questions: 0 }).lean();
    setCache("drills_list", drills, Number(process.env.CACHE_TTL_SECONDS || 60));

    res.json(drills);
  } catch (err) {
    next(err);
  }
});

// GET /api/drills/:id
router.get("/:id", async (req, res, next) => {
  try {
    const drill = await Drill.findById(req.params.id).lean();
    if (!drill) return res.status(404).json({ error: "Drill not found" });
    res.json(drill);
  } catch (err) {
    next(err);
  }
});

export default router;
