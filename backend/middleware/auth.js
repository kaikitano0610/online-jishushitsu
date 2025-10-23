const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // ヘッダーからトークンを取得
  const token = req.header('x-auth-token');

  // トークンがない場合
  if (!token) {
    return res.status(401).json({ msg: 'トークンがありません。認証が拒否されました。' });
  }

  // トークンを検証
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'トークンが有効ではありません。' });
  }
};