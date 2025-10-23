import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // カレンダーの基本スタイル
import styled from 'styled-components';
import api from '../utils/api';
import ReportModal from '../components/ReportModal';

// カレンダーのスタイルをゲーム風に上書き
const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    border: 2px solid #333;
    font-family: 'DotGothic16', sans-serif;
  }
  .react-calendar__tile {
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .react-calendar__tile--now {
    background: #ffff76;
  }
  .react-calendar__tile--active {
    background: #a2d7f5;
  }
`;

const ReportMarker = styled.div`
  margin-top: 8px;
  background-color: #ff8c00;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
`;

const StudentDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    setIsModalOpen(true);
  };

  const getReportForDate = (d) => {
    return reports.find(report => 
      new Date(report.date).toDateString() === d.toDateString()
    );
  };

  return (
    <div>
      <h1>がくしゅうレポート</h1>
      <CalendarWrapper>
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDateClick}
          tileContent={({ date, view }) =>
            view === 'month' && getReportForDate(date) ? (
              <ReportMarker>★提出済</ReportMarker>
            ) : null
          }
        />
      </CalendarWrapper>
      {isModalOpen && (
        <ReportModal 
          date={date}
          existingReport={getReportForDate(date)}
          onClose={() => setIsModalOpen(false)}
          onReportSubmit={fetchReports}
        />
      )}
    </div>
  );
};

export default StudentDashboard;