const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ status: 401, message: "Unauthorized Access" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.id; // Attach the user ID to the request object.
        req.userRole = decodedToken.role; // Attach user role for further checks.
        next();
    } catch (error) {
        return res.status(403).json({ status: 403, message: "Forbidden Access" });
    }
};
