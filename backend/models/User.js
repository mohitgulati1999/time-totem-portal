
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${this.name.replace(/\s+/g, '+')}&background=0D8ABC&color=fff`;
    }
  },
  membershipType: {
    type: String,
    enum: ['basic', 'premium', 'family', 'student', 'senior', 'corporate'],
    default: 'basic'
  },
  membershipDetails: {
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    feesPaid: {
      type: Boolean,
      default: false
    },
    lastPaymentDate: {
      type: Date
    },
    paymentHistory: [{
      amount: Number,
      date: Date,
      method: String,
      notes: String
    }]
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'suspended'],
    default: 'active'
  },
  rfidTag: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating total hours (will be populated from attendance records)
userSchema.virtual('totalHours').get(function() {
  // This will be implemented via a separate aggregation query
  return 0;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
