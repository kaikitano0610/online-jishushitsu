import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StudentCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 8px;
`;

const StudentInfo = styled.div`
  font-size: 18px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const PointButton = styled.button`
  background-color: #4caf50;
  color: white;
`;

const ReportLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #008cba;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border: 2px solid #333;
`;

const PointInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;


const MentorDashboard = () => {
    const [students, setStudents] = useState([]);
    const [pointInputs, setPointInputs] = useState({});

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error('生徒リストの取得に失敗しました', err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);
    
    const handlePointInputChange = (studentId, value) => {
        setPointInputs({
            ...pointInputs,
            [studentId]: value
        });
    };

    const handleUpdatePoints = async (studentId) => {
        const points = parseInt(pointInputs[studentId] || 0);
        if (isNaN(points)) {
            return alert('有効な数字を入力してください。');
        }
        try {
            await api.put(`/students/${studentId}/points`, { points });
            fetchStudents(); // リストを再読み込み
            setPointInputs({ ...pointInputs, [studentId]: '' }); // 入力欄をクリア
        } catch (err) {
            alert('ポイントの更新に失敗しました');
        }
    };

    return (
        <div>
            <h1>せいと いちらん</h1>
            <StudentList>
                {students.map(student => (
                    <StudentCard key={student._id}>
                        <StudentInfo>
                            {student.hasUncommentedReports && <span style={{ color: 'red', marginRight: '10px' }}>●</span>}
                            {student.username} - {student.points} P
                        </StudentInfo>
                        <Actions>
                            <PointInput 
                                type="number"
                                value={pointInputs[student._id] || ''}
                                onChange={(e) => handlePointInputChange(student._id, e.target.value)}
                                placeholder="±"
                            />
                            <PointButton onClick={() => handleUpdatePoints(student._id)}>
                                ポイント更新
                            </PointButton>
                            <ReportLink to={`/mentor/student/${student._id}`}>
                                レポートをみる
                            </ReportLink>
                        </Actions>
                    </StudentCard>
                ))}
            </StudentList>
        </div>
    );
};

export default MentorDashboard;