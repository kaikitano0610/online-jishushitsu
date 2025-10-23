const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  unlockedCharacters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);