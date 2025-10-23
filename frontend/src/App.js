import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import Layout from './components/Layout';
import GachaPage from './pages/GachaPage';
import CollectionPage from './pages/CollectionPage';
import MentorLayout from './components/MentorLayout'; // 不足していたインポートを追加
import StudentReportPage from './pages/StudentReportPage'; // 不足していたインポートを追加

// ログイン後に役割に応じて適切なダッシュボードにリダイレクトするコンポーネント
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <div>読み込み中...</div>;
  }

  return user.role === 'student' ? (
    <Navigate to="/student/dashboard" />
  ) : (
    <Navigate to="/mentor/dashboard" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========== 公開ルート ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ========== 保護されたルート (ここから下は全てログイン必須) ========== */}
          <Route element={<PrivateRoute />}>
            {/* 共通ルート */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* 生徒用ルート (生徒用のレイアウトで囲む) */}
            <Route path="/student" element={<Layout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="gacha" element={<GachaPage />} />
              <Route path="collection" element={<CollectionPage />} />
            </Route>

            {/* メンター用ルート (メンター用のレイアウトで囲む) */}
            <Route path="/mentor" element={<MentorLayout />}>
              <Route path="dashboard" element={<MentorDashboard />} />
              <Route path="student/:studentId" element={<StudentReportPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;