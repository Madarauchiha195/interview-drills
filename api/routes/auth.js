// api/routes/auth.js
import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Start Google OAuth
router.get("/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Google OAuth callback
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ code: "BAD_REQUEST", message: "Missing code" });

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const id_token = tokenRes.data.id_token;
    const payload = JSON.parse(Buffer.from(id_token.split(".")[1], "base64").toString());
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        providers: ["google"],
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store JWT in cookie
    res.cookie(process.env.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAME_SITE || "lax",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    // Redirect logic
    return res.redirect(`${process.env.WEB_ORIGIN || 'http://localhost:5173'}/dashboard`);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ code: "OAUTH_ERROR", message: "OAuth failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME);
  res.json({ ok: true });
});

export default router;
