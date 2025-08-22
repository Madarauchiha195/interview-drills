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
  if (!code) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Missing authorization code",
    });
  }

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
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const id_token = tokenRes.data.id_token;
    const payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    const { email, name, picture } = payload;

    if (!email) {
      throw new Error("Email not provided by Google");
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        picture,
        providers: ["google"],
      });
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      if (!user.providers.includes("google")) {
        user.providers.push("google");
      }
      await user.save();
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store JWT in cookie (cross-site safe)
    res.cookie(process.env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,     // must be true on Render (HTTPS)
    sameSite: "none", // critical for cross-site cookie sharing
    maxAge: 7 * 24 * 3600 * 1000,
    path: "/",
    });

    // Redirect to frontend dashboard
    const redirectUrl = `${
      process.env.WEB_ORIGIN || "http://localhost:5173"
    }/dashboard`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("OAuth error:", err.response?.data || err);

    const errorUrl = `${
      process.env.WEB_ORIGIN || "http://localhost:5173"
    }?error=auth_failed`;
    return res.redirect(errorUrl);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME || "session", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current auth status
router.get("/status", (req, res) => {
  const token = req.cookies?.[process.env.SESSION_COOKIE_NAME || "session"];
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        username: payload.username,
      },
    });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

export default router;
