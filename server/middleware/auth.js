import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.portfolio_session;
    if (!token)
      return res.status(401).json({ error: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.sessionVersion !== payload.version)
      return res.status(401).json({ error: "Session expired" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}
export function issueSession(res, user) {
  const token = jwt.sign(
    { sub: user.id, version: user.sessionVersion },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("portfolio_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 864e5,
  });
}
