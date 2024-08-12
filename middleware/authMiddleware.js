// Import the jsonwebtoken module at the top of the file
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('Auth Middleware Executed');  // Log to ensure middleware runs

    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);  // Log the authorization header

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);  // Log the token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;

        if (req.user.role !== 'instructor' && req.user.role !== 'admin' && req.user.role !== 'student') {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        next();
    } catch (err) {
        console.error('Token verification failed:', err);  // This should log if token verification fails
        res.status(400).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
