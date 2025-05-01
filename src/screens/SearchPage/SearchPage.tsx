import React, { useEffect, useState } from 'react';
import DogCard from '../../components/Dogcard/Dogcard';
import { Dog } from '../../types/Dog';
import { getBreeds, searchDogs, getDogsByIds } from '../../services/dogService';
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

  const size = 15;
  const totalPages = Math.ceil(totalCount / size);

  // 1) Load breed list once
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

  // 2) Search for dog IDs when filters change (skip when in Favorites Only)
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

  // 3) Fetch dog details for the current page
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

  // 4) When toggling into "Favorites Only", load all favorited dogs
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

  // Reset everything
  const resetFilters = () => {
    setSelectedBreed('');
    setAgeMin(0);
    setAgeMax(20);
    setZipCode('');
    setShowFavoritesOnly(false);
    setPage(0);
    setFavoriteDogs([]);
  };

  // Choose which list to render
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

      {/* Pagination (hidden in Favorites Only) */}
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

      {/* Dog Grid */}
      <main className="dog-list" role="list">
        {displayList.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </main>
    </div>
  );
};

export default SearchPage;
