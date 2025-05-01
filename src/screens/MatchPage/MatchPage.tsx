// src/screens/MatchPage/MatchPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DogCard from '../../components/Dogcard/Dogcard';
import { Dog } from '../../types/Dog';         
import { getDogsByIds } from '../../services/dogService';
import './MatchPage.css';

const MatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [matched] = await getDogsByIds([id]);
        setDog(matched);
      } catch {
        setError('Failed to load your match.');
      }
    })();
  }, [id]);

  if (error)   return <p className="match-error">{error}</p>;
  if (!dog)    return <p className="match-loading">Loading your match…</p>;

  return (
    <div className="match-page-bg">
      <div className="match-page-container">
        <h1>Your Perfect Match!</h1>
        <DogCard dog={dog} />
        <button className="back-button" onClick={() => navigate('/search')}>
          ← Back to Search
        </button>
      </div>
    </div>
  );
};

export default MatchPage;
