// api/routes/me.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.[process.env.SESSION_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "No session" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).lean();

    if (!user) {
      return res.status(404).json({ code: "NOT_FOUND", message: "User not found" });
    }

    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
});

export default router;
