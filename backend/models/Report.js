const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  studyContent: {
    type: String,
    required: true,
  },
  effortRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  studentComment: {
    type: String,
    default: '',
  },
  mentorComment: {
    type: String,
    default: '',
  },
  nextGoal: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);