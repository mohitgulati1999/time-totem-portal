
const mongoose = require('mongoose');
const crypto = require('crypto');

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for password
authSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Methods
authSchema.methods = {
  // Authenticate - check if the passwords are the same
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  
  // Generate salt
  makeSalt: function() {
    return crypto.randomBytes(16).toString('hex');
  },
  
  // Encrypt password
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

module.exports = mongoose.model('Auth', authSchema);
