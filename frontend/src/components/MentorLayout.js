import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

// Layout.jsからスタイルを拝借
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #4682b4; /* メンター用は少し落ち着いた色に */
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

const AppContainer = styled.div`
  padding: 0 20px 20px 20px;
`;


const MentorLayout = () => {
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
          <Link to="/mentor/dashboard">せいと いちらん</Link>
        </Nav>
        {user && (
          <UserInfo>
            <span>{user.username} (メンター)</span>
            <button onClick={handleLogout}>ログアウト</button>
          </UserInfo>
        )}
      </Header>
      <AppContainer>
        <Outlet />
      </AppContainer>
    </>
  );
};

export default MentorLayout;