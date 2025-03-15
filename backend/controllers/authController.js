
const Auth = require('../models/Auth');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new Auth({ username, email, password, role });
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Login user with hardcoded credentials
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded credentials check
    if (password === '12345678') {
      if (email === 'admin@laneenos.com') {
        // Admin user
        return res.status(200).json({
          token: jwt.sign(
            { _id: 'admin123', role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
          ),
          user: {
            _id: 'admin123',
            username: 'Admin',
            email: 'admin@laneenos.com',
            role: 'admin'
          }
        });
      } else if (email.match(/^member\d+@gmail\.com$/)) {
        // Member users (member1@gmail.com through member10@gmail.com)
        const memberNumber = email.match(/^member(\d+)@gmail\.com$/)[1];
        if (parseInt(memberNumber) >= 1 && parseInt(memberNumber) <= 10) {
          return res.status(200).json({
            token: jwt.sign(
              { _id: `member${memberNumber}`, role: 'user' },
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '7d' }
            ),
            user: {
              _id: `member${memberNumber}`,
              username: `Member ${memberNumber}`,
              email: email,
              role: 'user'
            }
          });
        }
      }
    }
    
    // If not using hardcoded credentials, try finding in database
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Check if password is correct
    if (!user.authenticate(password)) {
      return res.status(401).json({ message: 'Email and password do not match' });
    }
    
    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get user by ID (no longer protected)
exports.getUserById = async (req, res) => {
  try {
    // For testing purposes, return a mock user based on the ID
    const userId = req.params.userId;
    
    if (userId === 'admin123') {
      return res.status(200).json({
        _id: 'admin123',
        username: 'Admin',
        email: 'admin@laneenos.com',
        role: 'admin'
      });
    } else if (userId.startsWith('member')) {
      const memberNumber = userId.replace('member', '');
      return res.status(200).json({
        _id: userId,
        username: `Member ${memberNumber}`,
        email: `member${memberNumber}@gmail.com`,
        role: 'user'
      });
    }
    
    // If not a hardcoded user ID, try to find in the database
    const user = await Auth.findById(userId).select('-hashedPassword -salt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Auth middleware to verify JWT token - now just passes through for testing
exports.requireSignin = (req, res, next) => {
  // For testing, set a dummy auth object
  req.auth = { 
    _id: 'test123', 
    role: 'admin'  // Default to admin for testing
  };
  next();
};

// Admin authorization middleware - now just passes through for testing
exports.isAdmin = (req, res, next) => {
  // Always allow access for testing
  next();
};
