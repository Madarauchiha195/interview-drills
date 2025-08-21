import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[process.env.SESSION_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'unauthenticated' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}
