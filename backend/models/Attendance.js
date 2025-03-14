
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOut: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: null
  }
}, { timestamps: true });

// Pre-save middleware to calculate duration if check-out is provided
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    // Calculate duration in hours
    const durationMs = this.checkOut - this.checkIn;
    this.duration = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
