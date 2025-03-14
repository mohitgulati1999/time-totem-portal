
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Get all attendance records
exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('userId', 'name email avatar')
      .sort({ checkIn: -1 });
    
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records for a specific user
exports.getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await Attendance.find({ userId })
      .sort({ checkIn: -1 });
    
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check in a user
exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already checked in
    const existingCheckIn = await Attendance.findOne({
      userId,
      checkOut: null
    });
    
    if (existingCheckIn) {
      return res.status(400).json({ 
        message: 'User is already checked in',
        attendance: existingCheckIn
      });
    }
    
    // Create new check-in record
    const newAttendance = new Attendance({
      userId,
      checkIn: new Date()
    });
    
    const savedAttendance = await newAttendance.save();
    
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check out a user
exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the user's active check-in record
    const attendance = await Attendance.findOne({
      userId,
      checkOut: null
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'No active check-in found for this user' });
    }
    
    // Update record with check-out time
    attendance.checkOut = new Date();
    const savedAttendance = await attendance.save();
    
    res.status(200).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check in or out based on current status
exports.toggleAttendance = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user is already checked in
    const existingCheckIn = await Attendance.findOne({
      userId,
      checkOut: null
    });
    
    if (existingCheckIn) {
      // Check out
      existingCheckIn.checkOut = new Date();
      const savedAttendance = await existingCheckIn.save();
      
      res.status(200).json({
        message: 'User checked out successfully',
        isCheckIn: false,
        attendance: savedAttendance
      });
    } else {
      // Check in
      const newAttendance = new Attendance({
        userId,
        checkIn: new Date()
      });
      
      const savedAttendance = await newAttendance.save();
      
      res.status(201).json({
        message: 'User checked in successfully',
        isCheckIn: true,
        attendance: savedAttendance
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
