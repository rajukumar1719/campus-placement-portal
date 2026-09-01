const adminMiddleware = (req, res, next) => {
    // req.user authMiddleware ne set kia hai
    // Check karo role admin hai ya nahi

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Please login first'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only admin can access this resource'
        });
    }

    // Admin hai — agle function pe jao
    next();
};

module.exports = adminMiddleware;