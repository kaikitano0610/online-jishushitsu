import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../utils/api';
import StarRating from './StarRating';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px 40px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: 'DotGothic16', sans-serif;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-height: 80px;
  font-family: 'DotGothic16', sans-serif;
`;

const MentorCommentBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 5px;
  border: 1px dashed #4682b4;
`;

const ReportModal = ({ date, existingReport, onClose, onReportSubmit }) => {
  const [formData, setFormData] = useState({
    studyContent: '',
    effortRating: 0,
    studentComment: '',
    nextGoal: '',
  });

  useEffect(() => {
    if (existingReport) {
      setFormData({
        studyContent: existingReport.studyContent || '',
        effortRating: existingReport.effortRating || 0,
        studentComment: existingReport.studentComment || '',
        nextGoal: existingReport.nextGoal || '',
      });
    }
  }, [existingReport]);

  const { studyContent, effortRating, studentComment, nextGoal } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onRatingChange = rating => setFormData({ ...formData, effortRating: rating });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports', { ...formData, date });
      onReportSubmit(); // 親コンポーネントに通知して再読み込みさせる
      onClose(); // モーダルを閉じる
    } catch (err) {
      console.error(err);
      alert('レポートの提出に失敗しました。');
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>{new Date(date).toLocaleDateString()} のレポート</h2>
        {existingReport && existingReport.mentorComment && (
          <MentorCommentBox>
            <h4>先生からのコメント</h4>
            <p>{existingReport.mentorComment}</p>
          </MentorCommentBox>
        )}
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label>とりくんだこと</Label>
            <Textarea name="studyContent" value={studyContent} onChange={onChange} required />
          </FormGroup>
          <FormGroup>
            <Label>がんばりど</Label>
            <StarRating rating={effortRating} setRating={onRatingChange} />
          </FormGroup>
          <FormGroup>
            <Label>ひとことふりかえり</Label>
            <Textarea name="studentComment" value={studentComment} onChange={onChange} />
          </FormGroup>
          <FormGroup>
            <Label>つぎの目標</Label>
            <Input name="nextGoal" value={nextGoal} onChange={onChange} />
          </FormGroup>
          <button type="submit">ていしゅつする</button>
        </form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default ReportModal;