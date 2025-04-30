const isAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (user && user.role === "admin") {
      return next();
    }

    return res.status(403).json({ message: "Admin access only." });
  } catch (err) {
    console.error("❌ Admin check failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAdmin;
