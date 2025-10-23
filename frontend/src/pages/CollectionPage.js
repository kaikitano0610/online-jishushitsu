import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import CharacterCard from '../components/CharacterCard';

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
`;

const CollectionPage = () => {
  const { user } = useAuth();
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const res = await api.get('/characters/all');
        setAllCharacters(res.data);
      } catch (err) {
        console.error('キャラクター一覧の取得に失敗しました', err);
      }
      setLoading(false);
    };
    fetchAllCharacters();
  }, []);

  const unlockedIds = new Set(user.unlockedCharacters.map(char => char._id));

  if (loading) {
    return <div>ずかんを読み込み中...</div>;
  }

  return (
    <div>
      <h1>キャラクターずかん</h1>
      <p>集めたキャラクター: {unlockedIds.size} / {allCharacters.length} 体</p>
      <CollectionGrid>
        {allCharacters.map(char => (
          <CharacterCard 
            key={char.characterId} 
            character={char} 
            unlocked={unlockedIds.has(char._id)} 
          />
        ))}
      </CollectionGrid>
    </div>
  );
};

export default CollectionPage;