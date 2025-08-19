const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Routes handling user registration and login.
 */
module.exports = (models) => {
  const router = express.Router();
  const { User } = models;
  const secret = process.env.JWT_SECRET || 'secret';

  // POST /auth/register - create a new user with a hashed password
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash });
      const { id, role } = user;
      res.status(201).json({ id, name, email, role });
    } catch (err) {
      res.status(400).json({ message: 'Registration failed' });
    }
  });

  // POST /auth/login - verify credentials and return a signed JWT
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, secret, {
        expiresIn: '1h',
      });
      const { id, name, role, email: userEmail } = user;
      res.json({ token, user: { id, name, email: userEmail, role } });
    } catch (err) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  return router;
};
