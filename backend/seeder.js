const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
require('dotenv').config();

const User = require('./models/User');
const Character = require('./models/Character');

const characterData = [

  { characterId: 1, name: 'ギャラクシー・ドラゴン', rarity: 3 },
  { characterId: 2, name: '虹翼のフェニックス', rarity: 3 },
  { characterId: 3, name: '時空の白ウサギ', rarity: 3 },
  { characterId: 4, name: '黄金の聖獣ライオン', rarity: 3 },
  { characterId: 5, name: 'クリスタル・ユニコーン', rarity: 3 },
  { characterId: 6, name: 'メラメラきつね', rarity: 2 },

];


const importData = async () => {
  try {
    console.log('データベースに接続しています...');
    await connectDB();

    console.log('既存のデータを削除しています...');
    await User.deleteMany();
    await Character.deleteMany();

    // メンターアカウントの作成
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash('0000', salt);
    await User.create({
      username: 'mentor',
      pin: hashedPin,
      role: 'mentor',
    });
    console.log('メンターアカウントを作成しました');

    // 画像URLを自動生成してキャラクターデータを作成
    const charactersWithUrls = characterData.map(char => ({
      ...char,
      imageUrl: `/images/characters/${char.characterId}.png`
    }));

    await Character.insertMany(charactersWithUrls);
    console.log(`${charactersWithUrls.length}体のキャラクターを作成しました`);

    console.log('データ投入完了！');
    process.exit();
  } catch (error) {
    console.error(`エラー: ${error}`);
    process.exit(1);
  }
};

importData();