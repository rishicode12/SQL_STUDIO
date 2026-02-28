const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
};

const saveAttempt = async (req, res) => {
  const { assignmentId, query } = req.body;

  if (!assignmentId || !query) {
    return res.status(400).json({ success: false, error: 'assignmentId and query required.' });
  }

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        savedAttempts: { assignmentId, query, savedAt: new Date() },
      },
    });
    res.json({ success: true, message: 'Attempt saved.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save attempt.' });
  }
};

module.exports = { register, login, saveAttempt };
