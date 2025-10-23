const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // ✅ 1. Import the cors package

// .envファイルの読み込み
require('dotenv').config();

const app = express();

// データベース接続
connectDB();

// ミドルウェアの設定
app.use(cors()); // ✅ 2. Use the cors middleware
app.use(express.json({ extended: false })); // JSON形式のリクエストボディをパースする

// ルートURLへのレスポンス
app.get('/', (req, res) => res.send('API Running'));

// APIルートの定義 (cors()の後)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/gacha', require('./routes/gacha'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));