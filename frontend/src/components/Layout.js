import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const AppContainer = styled.div`
  padding: 0 20px 20px 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  margin-bottom: 20px;
`;

const Nav = styled.nav`
  & > a {
    color: white;
    text-decoration: none;
    margin: 0 15px;
    font-size: 18px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: 15px;
  }
`;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Header>
        <Nav>
          <Link to="/student/dashboard">レポート</Link>
          <Link to="/student/gacha">ガチャ</Link>
          <Link to="/student/collection">ずかん</Link>
        </Nav>
        {user && (
          <UserInfo>
            <span>{user.username} さん</span>
            <span>{user.points} P</span>
            <button onClick={handleLogout}>ログアウト</button>
          </UserInfo>
        )}
      </Header>
      <AppContainer>
        <Outlet /> {/* ここに各ページの中身が表示される */}
      </AppContainer>
    </>
  );
};

export default Layout;