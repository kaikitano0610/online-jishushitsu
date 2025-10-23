import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #ff6347;
  text-shadow: 2px 2px #333;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  & > * {
    margin: 0 15px;
  }
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>オンライン自習室</Title>
      <p>がくしゅうをきろくして、キャラクターをあつめよう！</p>
      <ButtonContainer>
        <Link to="/login"><button>ログイン</button></Link>
        <Link to="/register"><button>しんきとうろく</button></Link>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomePage;