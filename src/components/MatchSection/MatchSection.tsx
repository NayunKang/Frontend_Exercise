import React from 'react';
import './MatchSection.css';

interface MatchSectionProps {
  favoritesCount: number;
  onFindMatch: () => void;
}

const MatchSection: React.FC<MatchSectionProps> = ({
  favoritesCount,
  onFindMatch,
}) => {
  return (
    <>
      <p className="match-instruction">
        Turn your 🤍 on your favorite pups below, then click "Find My Match" to discover your perfect companion!
      </p>
      <div className="match-section">
        <button
          className="match-button"
          onClick={onFindMatch}
          disabled={favoritesCount === 0}
        >
          {favoritesCount === 0
            ? 'Select Favorites to Enable'
            : 'Find My Match'}
        </button>
      </div>
    </>
  );
};

export default MatchSection; 