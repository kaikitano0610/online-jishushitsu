const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Character = require('../models/Character');

// @route   GET api/characters
// @desc    ログイン中の生徒が解放済みのキャラクターリストを取得
// @access  Private (Student)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('unlockedCharacters');
    if (!user) {
      return res.status(404).json({ msg: 'ユーザーが見つかりません' });
    }
    res.json(user.unlockedCharacters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   GET api/characters/all
// @desc    全キャラクターのリストを取得（図鑑表示用）
// @access  Private
router.get('/all', auth, async (req, res) => {
    try {
        const characters = await Character.find().sort({ characterId: 1 });
        res.json(characters);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('サーバーエラー');
    }
});

module.exports = router;