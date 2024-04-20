const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [3, 'must be at least 3 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email');
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
  },
  address: {
    type: String,
  },
  coins: {
    type: Number,
    default: 0
  },
  feedback: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    }
  ],
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  blockedUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const users = mongoose.model('users', userSchema);
module.exports = users;
