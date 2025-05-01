import React from 'react';
import './Dogcard.css';
import { useFavorites } from '../../context/FavoritesContext';
import { Dog } from '../../types/Dog';

const DogCard: React.FC<{ dog: Dog }> = ({ dog }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(dog.id);

  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} className="dog-image" />
      <h3 className="dog-name">{dog.name}</h3>
      <p className="dog-breed">{dog.breed} · {dog.age} yrs</p>
      <p className="dog-location">📍 {dog.zip_code}</p>

      <button
        className="favorite-button"
        onClick={() => toggleFavorite(dog.id)}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFav ? '💛' : '🤍'}
      </button>
    </div>
  );
};

export default DogCard;
