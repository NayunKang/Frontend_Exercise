import React from 'react';
import './DogCard.css';
import { Dog } from '../../types/Dog';

interface DogCardProps {
  dog: Dog;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite = false, onToggleFavorite }) => {
  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} className="dog-image" />
      <h3 className="dog-name">{dog.name}</h3>
      <p className="dog-breed">{dog.breed} · {dog.age} yrs</p>
      <p className="dog-location">📍 {dog.zip_code}</p>

      {onToggleFavorite && (
        <button
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(dog.id)}
        >
          {isFavorite ? '💛' : '🤍'}
        </button>
      )}
    </div>
  );
};

export default DogCard;
