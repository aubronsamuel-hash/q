// Middleware to authorize based on user role
module.exports = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};
