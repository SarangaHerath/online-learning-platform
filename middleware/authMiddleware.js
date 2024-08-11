const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

    // Bearer <token> - we split to get the token only
    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Set the user on the request object
        req.user = decoded;

        // Continue to the next middleware/route handler
        next();
    } catch (err) {
        // If the token is invalid, return an error
        res.status(400).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
