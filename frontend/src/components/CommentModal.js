import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

// ReportModalからスタイルを拝借
const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
  background: white; padding: 20px 40px; border-radius: 10px;
  width: 500px; max-width: 90%;
`;
const ReportInfo = styled.div`
  background-color: #f9f9f9; border: 1px solid #ddd;
  border-radius: 5px; padding: 10px; margin-bottom: 15px;
`;
const Textarea = styled.textarea`
  width: 100%; padding: 8px; border-radius: 4px;
  border: 1px solid #ccc; min-height: 80px; font-family: 'DotGothic16', sans-serif;
`;

const CommentModal = ({ report, onClose, onCommentSubmit }) => {
  const [mentorComment, setMentorComment] = useState(report.mentorComment || '');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/reports/${report._id}`, { mentorComment });
      onCommentSubmit();
      onClose();
    } catch (err) {
      alert('コメントの送信に失敗しました');
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>レポートにコメントする</h2>
        <ReportInfo>
          <p><strong>とりくんだこと:</strong> {report.studyContent}</p>
          <p><strong>がんばりど:</strong> {'★'.repeat(report.effortRating)}</p>
          <p><strong>ひとこと:</strong> {report.studentComment}</p>
        </ReportInfo>
        <form onSubmit={onSubmit}>
          <Textarea 
            value={mentorComment} 
            onChange={e => setMentorComment(e.target.value)} 
            placeholder="はげましのコメントをかこう！"
          />
          <button type="submit">コメントをおくる</button>
        </form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default CommentModal;