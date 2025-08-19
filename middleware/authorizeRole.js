/**
 * Returns a middleware ensuring the user has the required role.
 * If the user does not meet the requirement, a 403 is returned.
 */
module.exports = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
