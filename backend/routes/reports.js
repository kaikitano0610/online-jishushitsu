const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');

// @route   POST api/reports
// @desc    新しいレポートを作成する
// @access  Private (Student)
router.post('/', auth, async (req, res) => {
  const { date, studyContent, effortRating, studentComment, nextGoal } = req.body;

  try {
    const newReport = new Report({
      studentId: req.user.id,
      date,
      studyContent,
      effortRating,
      studentComment,
      nextGoal,
    });

    const report = await newReport.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   GET api/reports
// @desc    ログイン中の生徒の全レポートを取得
// @access  Private (Student)
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

// @route   GET api/reports/student/:studentId
// @desc    特定の生徒の全レポートを取得 (メンター用)
// @access  Private (Mentor)
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const mentor = await User.findById(req.user.id);
        if (mentor.role !== 'mentor') {
            return res.status(403).json({ msg: 'アクセス権がありません' });
        }
        const reports = await Report.find({ studentId: req.params.studentId }).sort({ date: -1 });
        res.json(reports);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('サーバーエラー');
    }
});


// @route   PUT api/reports/:reportId
// @desc    レポートを更新する (主にメンターのコメント追記用)
// @access  Private
router.put('/:reportId', auth, async (req, res) => {
  const { mentorComment } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'mentor') {
        return res.status(403).json({ msg: 'コメントを追記する権限がありません' });
    }

    let report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ msg: 'レポートが見つかりません' });
    }
    
    // メンターのみコメントを更新可能
    if (mentorComment !== undefined) {
      report.mentorComment = mentorComment;
    }

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('サーバーエラー');
  }
});

module.exports = router;