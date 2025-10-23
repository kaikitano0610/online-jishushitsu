const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  characterId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
rarity: {
    type: Number, 
    min: 1,
    max: 3, 
    required: true,
  },
});

module.exports = mongoose.model('Character', CharacterSchema);