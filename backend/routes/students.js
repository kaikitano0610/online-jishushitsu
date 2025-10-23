const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Report = require('../models/Report');

// @route   GET api/students
// @desc    全生徒のリストを取得
// @access  Private (Mentor)
router.get('/', auth, async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id);
    if (mentor.role !== 'mentor') {
      return res.status(403).json({ msg: 'アクセス権がありません' });
    }
    
    // 全ての生徒を取得
    let students = await User.find({ role: 'student' }).select('-pin').lean(); // .lean()を追加

    // コメントが空のレポートを持つ生徒IDのリストを取得
    const uncommentedReports = await Report.find({ mentorComment: '' }).distinct('studentId');
    const uncommentedStudentIds = new Set(uncommentedReports.map(id => id.toString()));

    // 各生徒に未読フラグを立てる
    students = students.map(student => ({
        ...student,
        hasUncommentedReports: uncommentedStudentIds.has(student._id.toString())
    }));

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   POST api/students/:studentId/points
// @desc    指定した生徒にポイントを1付与
// @access  Private (Mentor)
router.put('/:studentId/points', auth, async (req, res) => {
    try {
        const mentor = await User.findById(req.user.id);
        if (mentor.role !== 'mentor') {
            return res.status(403).json({ msg: 'アクセス権がありません' });
        }

        const { points } = req.body;
        if (typeof points !== 'number') {
            return res.status(400).json({ msg: 'ポイントは数字で入力してください' });
        }

        const student = await User.findByIdAndUpdate(
            req.params.studentId,
            { $inc: { points: points } }, // pointsを指定された数だけ増減
            { new: true }
        ).select('-pin');

        if (!student) {
            return res.status(404).json({ msg: '生徒が見つかりません' });
        }

        res.json(student);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('サーバーエラー');
    }
});

module.exports = router;