import React, { useEffect, useState } from 'react';
import DogCard from '../../components/Dogcard/Dogcard';
import { Dog } from '../../types/Dog';
import { getBreeds, searchDogs, getDogsByIds } from '../../services/dogService';
import './SearchPage.css';

const SearchPage = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(20);
  const [zipCode, setZipCode] = useState('');
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  const size = 15;
  const totalPages = Math.ceil(totalCount / size);

  // Fetch breed list
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

  // Search dog IDs whenever filters change
  useEffect(() => {
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
  }, [selectedBreed, page, ageMin, ageMax, zipCode]);

  // Fetch dog details once IDs are loaded
  useEffect(() => {
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
  }, [dogIds]);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );

  const resetFilters = () => {
    setSelectedBreed('');
    setAgeMin(0);
    setAgeMax(20);
    setZipCode('');
    setShowFavoritesOnly(false);
    setPage(0);
  };

  const displayList = showFavoritesOnly
    ? dogs.filter((d) => favorites.includes(d.id))
    : dogs;

  return (
    <div className="search-page-container">
      <header className="search-hero">
        <h1>🐶 Find Your Next Best Friend</h1>
        <p>Filter by age, location, or your favorites.</p>
      </header>

      <section className="filter-panel">
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

        <div className="filter-group toggle-group">
          <label htmlFor="fav-toggle">Favorites Only</label>
          <input
            id="fav-toggle"
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={() => setShowFavoritesOnly((f) => !f)}
          />
        </div>

        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </section>

      {/* Pagination moved up between filters and grid */}
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

      <main className="dog-list" role="list">
        {displayList.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={favorites.includes(dog.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </main>
    </div>
  );
};

export default SearchPage;
