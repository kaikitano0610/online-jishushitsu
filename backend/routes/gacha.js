const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Character = require('../models/Character');

// @route   POST api/gacha
// @desc    ガチャを引く
// @access  Private (Student)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // ポイントが足りるかチェック
    if (user.points < 3) {
      return res.status(400).json({ msg: 'ポイントが足りません' });
    }

    // データベース上の全キャラクターを取得
    const allCharacters = await Character.find();
    if (allCharacters.length === 0) {
        return res.status(500).json({ msg: 'ガチャ対象のキャラクターがいません。' });
    }

    // 全キャラクターの中からランダムに1体選ぶ
    const chosenCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];

    // ユーザー情報を更新
    user.points -= 3;
    user.unlockedCharacters.push(chosenCharacter._id);
    await user.save();

    res.json(chosenCharacter);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;