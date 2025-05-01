import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogCard from '../../components/Dogcard/Dogcard';
import { Dog } from '../../types/Dog';
import {
  getBreeds,
  searchDogs,
  getDogsByIds,
  findMatch,
} from '../../services/dogService';
import { useFavorites } from '../../context/FavoritesContext';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(20);
  const [zipCode, setZipCode] = useState('');
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const { favorites } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const size = 15;
  const totalPages = Math.ceil(totalCount / size);

  // Load breed list once
  useEffect(() => {
    (async () => {
      try {
        const data = await getBreeds();
        setBreeds(data);
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    })();
  }, []);

  // Search for dog IDs when filters change
  useEffect(() => {
    if (showFavoritesOnly) return;
    (async () => {
      try {
        const data = await searchDogs({
          breed: selectedBreed,
          sort: 'asc',
          size,
          from: page * size,
          ageMin,
          ageMax,
          zipCode,
        });
        setDogIds(data.resultIds || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Error searching dogs:', err);
      }
    })();
  }, [selectedBreed, page, ageMin, ageMax, zipCode, showFavoritesOnly]);

  // Fetch dog details for current page
  useEffect(() => {
    if (showFavoritesOnly) return;
    (async () => {
      if (!dogIds.length) {
        setDogs([]);
        return;
      }
      try {
        const data = await getDogsByIds(dogIds);
        setDogs(data);
      } catch (err) {
        console.error('Error fetching dog details:', err);
      }
    })();
  }, [dogIds, showFavoritesOnly]);

  // Load favorites-only list
  useEffect(() => {
    if (!showFavoritesOnly) {
      setFavoriteDogs([]);
      return;
    }
    (async () => {
      if (!favorites.length) {
        setFavoriteDogs([]);
        return;
      }
      try {
        const data = await getDogsByIds(favorites);
        setFavoriteDogs(data);
      } catch (err) {
        console.error('Error fetching favorite dogs:', err);
      }
    })();
  }, [showFavoritesOnly, favorites]);

  // Navigate to match page
  const handleFindMatch = async () => {
    try {
      const { match: matchId } = await findMatch(favorites);
      navigate(`/match/${matchId}`);
    } catch {
      alert('Unable to find a match—please try again.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBreed('');
    setAgeMin(0);
    setAgeMax(20);
    setZipCode('');
    setShowFavoritesOnly(false);
    setPage(0);
    setFavoriteDogs([]);
  };

  const displayList = showFavoritesOnly ? favoriteDogs : dogs;

  return (
    <div className="search-page-container">
      <header className="search-hero">
        <h1>🐶 Find Your Next Best Friend</h1>
        <p>Filter by age, location, or your favorites.</p>
      </header>

      <section className="filter-panel">
        {/* Tab Toggle */}
        <div className="filter-tabs">
          <button
            className={!showFavoritesOnly ? 'active' : ''}
            onClick={() => setShowFavoritesOnly(false)}
          >
            All Dogs
          </button>
          <button
            className={showFavoritesOnly ? 'active' : ''}
            onClick={() => setShowFavoritesOnly(true)}
          >
            Favorites
          </button>
        </div>

        {/* Breed */}
        <div className="filter-group">
          <label htmlFor="breed-select">Breed</label>
          <select
            id="breed-select"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="">All Breeds</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Age Range */}
        <div className="filter-group">
          <label>Age Range</label>
          <div className="age-inputs">
            <input
              type="number"
              min={0}
              max={ageMax}
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
            />
            <span>–</span>
            <input
              type="number"
              min={ageMin}
              max={25}
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ZIP Code */}
        <div className="filter-group">
          <label htmlFor="zip-code">ZIP Code</label>
          <input
            id="zip-code"
            type="text"
            placeholder="e.g. 90210"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        {/* Reset */}
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </section>

      {/* Instruction & Match Button */}
      {!showFavoritesOnly && (
        <>
          <p className="match-instruction">
            Select your favorite pups above, then click “Find My Match” to discover your perfect companion!
          </p>
          <div className="match-section">
            <button
              className="match-button"
              onClick={handleFindMatch}
              disabled={favorites.length === 0}
            >
              {favorites.length === 0 ? 'Select Favorites to Enable' : 'Find My Match'}
            </button>
          </div>
        </>
      )}

      {/* Dog Grid */}
      <main className="dog-list" role="list">
        {displayList.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </main>

      {/* Pagination moved to the very bottom */}
      {!showFavoritesOnly && (
        <div className="hero-pagination" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            ◀ Prev
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
