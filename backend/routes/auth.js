const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    生徒を新規登録する
// @access  Public
router.post('/register', async (req, res) => {
  const { username, pin } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'このIDは既に使用されています' });
    }

    user = new User({
      username,
      pin,
      role: 'student',
    });

    const salt = await bcrypt.genSalt(10);
    user.pin = await bcrypt.hash(pin, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   POST api/auth/login
// @desc    ログイン
// @access  Public
router.post('/login', async (req, res) => {
  const { username, pin } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'IDまたは暗証番号が違います' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({ msg: 'IDまたは暗証番号が違います' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   GET api/auth/me
// @desc    ログイン中のユーザー情報を取得
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // ✅ .populate('unlockedCharacters') を追加してキャラクター詳細を取得
    const user = await User.findById(req.user.id).select('-pin').populate('unlockedCharacters');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;