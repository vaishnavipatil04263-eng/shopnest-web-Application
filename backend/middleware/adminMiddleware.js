const admin = (req, res, next) => {
    console.log("=== ADMIN MIDDLEWARE ===");
    console.log(req.user);

    if (req.user && req.user.role === "admin") {
        console.log("Admin Access Granted");
        return next();
    }

    console.log("Admin Access Denied");
    return res.status(403).json({ error: "Access denied, admin only" });
};

module.exports = { admin };