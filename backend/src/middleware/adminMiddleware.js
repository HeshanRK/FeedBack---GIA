export const adminOnly = (req, res, next) => {
  // expects req.user to be set by authenticate
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};
