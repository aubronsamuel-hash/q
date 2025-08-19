// Controller for authentication operations
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Register a new user.
 * Password is hashed before storage and role defaults to 'user'.
 * Returns a safe user profile without the password.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'user' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.status(201).json(safeUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to register user' });
  }
};

/**
 * Authenticate a user and issue a JWT token.
 * The token contains the user id and role.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail closed if no secret is configured
      return res.status(500).json({ message: 'JWT secret not configured' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to login' });
  }
};
