
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
    enum: ['basic', 'premium', 'family'],
    default: 'basic'
  },
  membershipFee: {
    type: Number,
    default: function() {
      switch(this.membershipType) {
        case 'premium': return 99.99;
        case 'family': return 149.99;
        default: return 49.99; // basic
      }
    }
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  nextPaymentDue: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    }
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'paid'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  rfidTag: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  notes: {
    type: String,
    default: ''
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
