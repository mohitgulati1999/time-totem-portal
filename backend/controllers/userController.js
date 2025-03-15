
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    // For each user, calculate their total hours
    const usersWithHours = await Promise.all(users.map(async (user) => {
      const totalHours = await calculateTotalHours(user._id);
      const userObj = user.toObject();
      userObj.totalHours = totalHours;
      return userObj;
    }));
    
    res.status(200).json(usersWithHours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userObj = user.toObject();
    userObj.totalHours = await calculateTotalHours(user._id);
    
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userObj = updatedUser.toObject();
    userObj.totalHours = await calculateTotalHours(updatedUser._id);
    
    res.status(200).json(userObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete all attendance records for this user
    await Attendance.deleteMany({ userId: req.params.id });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a user by RFID tag
exports.findUserByRfid = async (req, res) => {
  try {
    const { rfidTag } = req.params;
    const user = await User.findOne({ rfidTag });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userObj = user.toObject();
    userObj.totalHours = await calculateTotalHours(user._id);
    
    // Check if user is already checked in
    const isCheckedIn = await Attendance.findOne({
      userId: user._id,
      checkOut: null
    });
    
    res.status(200).json({
      user: userObj,
      isCheckedIn: !!isCheckedIn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate total hours for a user
async function calculateTotalHours(userId) {
  try {
    const records = await Attendance.find({
      userId,
      duration: { $ne: null }
    });
    
    return records.reduce((total, record) => total + (record.duration || 0), 0);
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
}

// Get usage statistics for a user or all users
exports.getUserUsageStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get the date for the start of the current week (Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Query filter
    const filter = {
      checkIn: { $gte: startOfWeek },
      duration: { $ne: null }
    };
    
    // If a specific user is requested, add that to filter
    if (userId !== 'all') {
      filter.userId = new mongoose.Types.ObjectId(userId);
    }
    
    // Aggregate attendance data by day
    const usageData = await Attendance.aggregate([
      { $match: filter },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$checkIn" }, // 1 = Sunday, 2 = Monday, etc.
          duration: 1
        }
      },
      {
        $group: {
          _id: "$dayOfWeek",
          hours: { $sum: "$duration" }
        }
      },
      {
        $project: {
          _id: 0,
          day: {
            $arrayElemAt: [days, { $subtract: ["$_id", 1] }]
          },
          hours: { $round: ["$hours", 1] }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Fill in missing days with zero hours
    const result = days.map(day => {
      const found = usageData.find(d => d.day === day);
      return found || { day, hours: 0 };
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
