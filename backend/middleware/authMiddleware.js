const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Authorization Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                error: "No authorization header"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Bearer token format invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                error: "Token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded:", decoded);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        next();

    } catch (error) {
        console.log("JWT Error:", error.message);

        return res.status(401).json({
            error: error.message
        });
    }
};

module.exports = { protect };