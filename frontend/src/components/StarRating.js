import React, { useState } from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Star = styled.span`
  font-size: 2rem;
  color: ${props => (props.filled ? '#ffc107' : '#e4e5e9')};
`;

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            filled={ratingValue <= (hover || rating)}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </Star>
        );
      })}
    </StarContainer>
  );
};

export default StarRating;