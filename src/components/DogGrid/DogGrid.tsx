import React from 'react';
import DogCard from '../Dogcard/Dogcard'; 
import { Dog } from '../../types/Dog';
import './DogGrid.css';

interface DogGridProps {
  dogs: Dog[];
}

const DogGrid: React.FC<DogGridProps> = ({ dogs }) => {
  if (dogs.length === 0) {
    return <p className="dog-list-empty">No dogs match the current criteria.</p>; 
  }

  return (
    <main className="dog-list" role="list">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </main>
  );
};

export default DogGrid; 