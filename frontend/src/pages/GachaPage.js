import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const GachaContainer = styled.div`
  text-align: center;
`;

const GachaButton = styled.button`
  padding: 20px 40px;
  font-size: 24px;
  background-color: #f44336;
  color: white;
  border: 4px solid #333;
  box-shadow: 8px 8px 0px #333;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: 4px 4px 0px #999;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const zoomIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

const ResultContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  border: 5px solid gold;
  animation: ${zoomIn} 0.3s ease-out;
`;

const Rarity = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: ${props => {
    if (props.rarity === 3) return '#ff4500';
    if (props.rarity === 2) return '#1e90ff';
    return '#333';
  }};
`;

const GachaPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGachaDraw = async () => {
    setLoading(true);
    try {
      const res = await api.post('/gacha');
      const newCharacter = res.data;
      setResult(newCharacter);

      // ✅ ここからが修正箇所です
      // ポイントを減らし、獲得したキャラクターもリストに追加してユーザー情報を更新します
      const updatedUser = {
        ...user,
        points: user.points - 3,
        unlockedCharacters: [...user.unlockedCharacters, newCharacter],
      };
      updateUser(updatedUser);
      // ✅ ここまで

    } catch (err) {
      alert(err.response?.data?.msg || 'ガチャを引けませんでした。');
    }
    setLoading(false);
  };

  return (
    <GachaContainer>
      <h1>ポイントガチャ</h1>
      <p>3ポイントで1回ひける！</p>
      <GachaButton onClick={handleGachaDraw} disabled={loading || !user || user.points < 3}>
        {loading ? 'ひいてる...' : 'ガチャをひく！'}
      </GachaButton>

      {result && (
        <ModalBackdrop onClick={() => setResult(null)}>
          <ResultContent onClick={e => e.stopPropagation()}>
            <h1>でてきたのは...</h1>
            <img src={result.imageUrl} alt={result.name} />
            <Rarity rarity={result.rarity}>{'★'.repeat(result.rarity)}</Rarity>
            <h2>{result.name}</h2>
            <button onClick={() => setResult(null)}>とじる</button>
          </ResultContent>
        </ModalBackdrop>
      )}
    </GachaContainer>
  );
};

export default GachaPage;