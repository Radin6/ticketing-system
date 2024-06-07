export default function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, do not have permison to perform this action" })
  }

  next();
}