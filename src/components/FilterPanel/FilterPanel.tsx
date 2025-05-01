import React from 'react';
import './FilterPanel.css';

interface FilterPanelProps {
  breeds: string[];
  selectedBreed: string;
  setSelectedBreed: (breed: string) => void;
  ageMin: number;
  setAgeMin: (age: number) => void;
  ageMax: number;
  setAgeMax: (age: number) => void;
  locationMode: 'zip' | 'city' | 'map' | 'none';
  setLocationMode: (mode: 'zip' | 'city' | 'map' | 'none') => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  cityQuery: string;
  setCityQuery: (query: string) => void;
  fetchZipsForCity: () => void;
  resetFilters: () => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  showMapSearch: boolean;
  setShowMapSearch: (show: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  breeds,
  selectedBreed,
  setSelectedBreed,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  locationMode,
  setLocationMode,
  zipCode,
  setZipCode,
  cityQuery,
  setCityQuery,
  fetchZipsForCity,
  resetFilters,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showMapSearch,
  setShowMapSearch,
}) => {
  return (
    <section className="filter-panel">
      <div className="filter-tabs">
        <button className={!showFavoritesOnly ? 'active' : ''} onClick={() => setShowFavoritesOnly(false)}>All Dogs</button>
        <button
          className={showFavoritesOnly ? 'active' : ''}
          onClick={() => setShowFavoritesOnly(true)}
        >
          Favorites 💛
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-item">
          <label htmlFor="breed-select">Breed</label>
          <select
            id="breed-select"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            disabled={showFavoritesOnly}
          >
            <option value="">All Breeds</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Age Range</label>
          <div className="age-inputs">
            <input
              type="number"
              min={0}
              max={ageMax}
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              disabled={showFavoritesOnly}
            />
            <span>–</span>
            <input
              type="number"
              min={ageMin}
              max={25}
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              disabled={showFavoritesOnly}
            />
          </div>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-item">
          <label>Location Filter By:</label>
          <div className="location-modes">
            <label>
              <input type="radio" name="locationMode" value="none" checked={locationMode === 'none'} onChange={() => setLocationMode('none')} disabled={showFavoritesOnly} /> None
            </label>
            <label>
              <input type="radio" name="locationMode" value="zip" checked={locationMode === 'zip'} onChange={() => setLocationMode('zip')} disabled={showFavoritesOnly} /> ZIP Code
            </label>
            <label>
              <input type="radio" name="locationMode" value="city" checked={locationMode === 'city'} onChange={() => setLocationMode('city')} disabled={showFavoritesOnly} /> City
            </label>
            <label>
              <input type="radio" name="locationMode" value="map" checked={locationMode === 'map'} onChange={() => setLocationMode('map')} disabled={showFavoritesOnly} /> Map
            </label>
          </div>
        </div>

        {locationMode === 'zip' && (
          <div className="filter-item">
            <label htmlFor="zip-code">ZIP Code</label>
            <input
              id="zip-code"
              type="text"
              placeholder="e.g. 90210"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              disabled={showFavoritesOnly}
            />
          </div>
        )}
        {locationMode === 'city' && (
          <div className="filter-item">
            <label htmlFor="city-input">City</label>
            <div className="city-lookup">
              <input
                id="city-input"
                type="text"
                placeholder="e.g. San Francisco"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                disabled={showFavoritesOnly}
              />
              <button onClick={fetchZipsForCity} disabled={showFavoritesOnly}>Lookup ZIPs</button>
            </div>
          </div>
        )}
        {locationMode === 'map' && (
          <div className="filter-item">
            <label>Map Search</label>
            <button
              onClick={() => setShowMapSearch(true)}
              disabled={showFavoritesOnly}
              className={`map-toggle-button ${showMapSearch ? 'active' : ''}`}
            >
              {showMapSearch ? 'Update Map Search' : 'Open Map Search'}
            </button>
          </div>
        )}
      </div>

      <div className="filter-controls">
        <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
      </div>
    </section>
  );
};

export default FilterPanel;
