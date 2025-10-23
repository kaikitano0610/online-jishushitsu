import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import api from '../utils/api';
import CommentModal from '../components/CommentModal';

// StudentDashboardからスタイルを拝借
const CalendarWrapper = styled.div`
  .react-calendar { width: 100%; border: 2px solid #333; font-family: 'DotGothic16', sans-serif; }
  .react-calendar__tile { height: 100px; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; }
  .react-calendar__tile--now { background: #ffff76; }
`;
const ReportMarker = styled.div`
  margin-top: 8px; padding: 2px 5px; border-radius: 4px; font-size: 12px;
  background-color: ${props => props.commented ? '#4caf50' : '#ff8c00'};
  color: white;
`;

const StudentReportPage = () => {
    const { studentId } = useParams(); // URLから生徒IDを取得
    const [student, setStudent] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    const fetchStudentData = async () => {
        try {
            // このAPIはまだ作っていないので、今回はレポートのみ取得します。
            // 必要であれば、/api/students/:studentId のようなAPIを作ると良いでしょう。
            const reportRes = await api.get(`/reports/student/${studentId}`);
            setReports(reportRes.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const getReportForDate = (d) => {
        return reports.find(report => 
          new Date(report.date).toDateString() === d.toDateString()
        );
    };

    const handleDateClick = (clickedDate) => {
        const report = getReportForDate(clickedDate);
        if (report) { // レポートが提出されている日だけモーダルを開く
            setSelectedReport(report);
        }
    };

    return (
        <div>
            <h1>せいとのレポート</h1>
            <CalendarWrapper>
                <Calendar 
                    onClickDay={handleDateClick}
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const report = getReportForDate(date);
                            if (report) {
                                return <ReportMarker commented={!!report.mentorComment}>
                                    {report.mentorComment ? '✔コメント済' : '★提出済'}
                                </ReportMarker>
                            }
                        }
                        return null;
                    }}
                />
            </CalendarWrapper>
            {selectedReport && (
                <CommentModal 
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onCommentSubmit={fetchStudentData}
                />
            )}
        </div>
    );
};

export default StudentReportPage;