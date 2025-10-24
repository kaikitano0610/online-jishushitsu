const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Report = require('../models/Report');

// @route   GET api/students
// @desc    全生徒のリストを取得（未読レポート情報付き）
// @access  Private (Mentor)
router.get('/', auth, async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id);
    if (mentor.role !== 'mentor') {
      return res.status(403).json({ msg: 'アクセス権がありません' });
    }
    
    let students = await User.find({ role: 'student' }).select('-pin').lean();

    // ✅ 修正箇所: 未コメントのレポートを「コメントがnullまたは空文字列」として検索します
    const uncommentedReports = await Report.find({ mentorComment: { $in: [null, ''] } }).distinct('studentId');
    const uncommentedStudentIds = new Set(uncommentedReports.map(id => id.toString()));

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


// @route   PUT api/students/:studentId/points
// @desc    指定した生徒のポイントを指定数だけ増減させる
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
            { $inc: { points: points } },
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