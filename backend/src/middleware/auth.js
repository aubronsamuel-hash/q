// Middleware to verify JWT tokens and attach user info
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Reject requests when the secret is missing for security
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    // Only expose id and role to downstream handlers
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
