import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 2px solid #333;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background-color: ${props => (props.unlocked ? '#fff' : '#eee')};
  filter: ${props => (props.unlocked ? 'none' : 'grayscale(100%) brightness(60%)')};
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const CharacterImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const CharacterName = styled.h3`
  font-size: 16px;
  margin: 5px 0;
`;

const RarityStars = styled.div`
  color: #ffc107;
  font-size: 16px;
  margin-top: 5px;
`;

const CharacterCard = ({ character, unlocked }) => {
  return (
    <Card unlocked={unlocked}>
      <ImageContainer>
        {unlocked ? (
          <CharacterImage src={character.imageUrl} alt={character.name} />
        ) : (
          <span style={{ fontSize: '48px' }}>？</span>
        )}
      </ImageContainer>
      <CharacterName>{unlocked ? character.name : '？？？？'}</CharacterName>
      {unlocked && (
        <RarityStars>{'★'.repeat(character.rarity)}</RarityStars>
      )}
    </Card>
  );
};

export default CharacterCard;