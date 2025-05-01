import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import DogGrid from '../../components/DogGrid/DogGrid';
import DogMap from '../../components/DogMap/DogMap';
import Pagination from '../../components/Pagination/Pagination';
import MatchSection from '../../components/MatchSection/MatchSection';
import { Dog } from '../../types/Dog';
import { Location } from '../../types/Locations';
import {
  getBreeds,
  searchDogs,
  getDogsByIds,
  findMatch,
  DogSearchParams,
} from '../../services/dogService';
import { searchLocations, getLocationsByZips } from '../../services/locationService';
import { useFavorites } from '../../context/FavoritesContext';
import './SearchPage.css';

const kmToDegLat = (km: number) => km / 111;
const kmToDegLon = (km: number, lat: number) =>
  km / (111 * Math.cos((lat * Math.PI) / 180));

type LocationMode = 'zip' | 'city' | 'map' | 'none';

const SearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(20);

  const [locationMode, setLocationMode] = useState<LocationMode>('none');
  const [zipCode, setZipCode] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  const [resolvedZips, setResolvedZips] = useState<string[]>([]);

  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const { favorites } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const [dogLocations, setDogLocations] = useState<Location[]>([]);

  const [bboxZips, setBboxZips] = useState<string[] | null>(null);

  const [showMapSearch, setShowMapSearch] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10); 
  const [mapCenter, setMapCenter] = useState<L.LatLng | null>(null);

  const size = 15;
  const totalPages = Math.ceil(totalCount / size);

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

  const fetchZipsForCity = async () => {
    if (!cityQuery.trim()) return;
    setLocationMode('city');
    setShowMapSearch(false);
    setMapCenter(null);
    try {
      const { results } = await searchLocations({
        city: cityQuery.trim(),
        size: 10000, 
      });
      const zips = results.map((loc) => loc.zip_code);
      setResolvedZips(zips);
      setBboxZips(null);
      setZipCode('');
      setPage(0);
    } catch (err) {
      console.error('City -> ZIP lookup failed:', err);
    }
  };

  useEffect(() => {
    if (showFavoritesOnly) return;
    (async () => {
      try {
        const params: DogSearchParams = {
          breed: selectedBreed || undefined,
          sort: 'asc' as const,
          size,
          from: page * size,
          ageMin,
          ageMax,
        };

         let finalZipCodes: string[] | undefined = undefined;
        if (zipCode) {
          finalZipCodes = [zipCode];
        } else if (bboxZips !== null) { 
          finalZipCodes = bboxZips;
          if (finalZipCodes.length === 0) {
            console.log("Radius search yielded 0 ZIP codes.");
          }
        } else if (resolvedZips.length) {
          finalZipCodes = resolvedZips;
        }

        if (finalZipCodes !== undefined) {
          params.zipCodes = finalZipCodes;
        } else {
          delete params.zipCodes; 
        }

        const data = await searchDogs(params);
        setDogIds(data.resultIds || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Error searching dogs:', err);
        setDogIds([]);
        setTotalCount(0);
      }
    })();
  }, [
    selectedBreed,
    page,
    ageMin,
    ageMax,
    zipCode,    
    resolvedZips,
    bboxZips,   
    showFavoritesOnly,
  ]);

  useEffect(() => {
    if (showFavoritesOnly || !dogIds.length) {
      setDogs([]);
      setDogLocations([]); 
      return;
    }
    (async () => {
      try {
        const dogsData = await getDogsByIds(dogIds);
        setDogs(dogsData);

        if (dogsData.length > 0) {
          const uniqueZips = Array.from(new Set(dogsData.map(d => d.zip_code)));
          if (uniqueZips.length > 0) {
            const locationsData = await getLocationsByZips(uniqueZips);
            setDogLocations(locationsData);
          } else {
            setDogLocations([]);
          }
        } else {
          setDogLocations([]); 
        }

      } catch (err) {
        console.error('Error fetching dog details or locations:', err);
        setDogs([]);
        setDogLocations([]);
      }
    })();
  }, [dogIds, showFavoritesOnly]);

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

  const handleFindMatch = async () => {
    try {
      const { match: matchId } = await findMatch(favorites);
      navigate(`/match/${matchId}`);
    } catch {
      alert('Unable to find a match—please try again.');
    }
  };

  const resetFilters = () => {
    setSelectedBreed('');
    setAgeMin(0);
    setAgeMax(20);
    setZipCode('');
    setCityQuery('');
    setResolvedZips([]);
    setBboxZips(null); 
    setShowFavoritesOnly(false);
    setPage(0);
    setFavoriteDogs([]);
    setDogLocations([]); 
    setShowMapSearch(false); 
    setRadiusKm(10);       
    setMapCenter(null);    
    setLocationMode('none');
  };

  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
    if (value) {
        setLocationMode('zip'); 
        setShowMapSearch(false);
        setMapCenter(null);
        setBboxZips(null);
        setCityQuery('');
        setResolvedZips([]);
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setMapCenter(latlng);
    setLocationMode('map');
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    setRadiusKm(newRadius);
  };

  const triggerRadiusSearch = async (center: L.LatLng | null, radius: number) => {
     if (!center) return;
     console.log(`Searching radius ${radius}km around ${center.lat}, ${center.lng}`);
    try {
      const latDelta = kmToDegLat(radius);
      const lonDelta = kmToDegLon(radius, center.lat);
      const geoBoundingBox = {
        top: center.lat + latDelta,
        bottom: center.lat - latDelta,
        left: center.lng - lonDelta,
        right: center.lng + lonDelta,
      };

      const { results } = await searchLocations({
        geoBoundingBox,
        size: 10000, 
      });
      const zipCodes = results.map((l) => l.zip_code);
      console.log("Found zips in radius:", zipCodes);
      setBboxZips(zipCodes); // This triggers the search useEffect
      setZipCode('');
      setCityQuery('');
      setResolvedZips([]);
      setPage(0);
    } catch (err) {
      console.error('Error fetching locations for radius search:', err);
      setBboxZips(null);
    }
  };

  const displayList = showFavoritesOnly ? favoriteDogs : dogs;

  return (
    <div className="search-page-container">
      <header className="search-hero">
        <h1>🐶 Find Your Next Best Friend</h1>
        <p>Use the filters below to find dogs by breed, age, and location, or view your saved favorites.</p>
      </header>

      {/* Use FilterPanel component */}
      <FilterPanel
        breeds={breeds}
        selectedBreed={selectedBreed}
        setSelectedBreed={setSelectedBreed}
        ageMin={ageMin}
        setAgeMin={setAgeMin}
        ageMax={ageMax}
        setAgeMax={setAgeMax}
        locationMode={locationMode}
        setLocationMode={setLocationMode}
        zipCode={zipCode}
        setZipCode={handleZipCodeChange}
        cityQuery={cityQuery}
        setCityQuery={setCityQuery}
        fetchZipsForCity={fetchZipsForCity}
        resetFilters={resetFilters}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        showMapSearch={showMapSearch}
        setShowMapSearch={(show) => {
            setShowMapSearch(show);
            if (!show && locationMode === 'map') {
                setLocationMode('none');
            }
        }}
      />

      {/* Conditionally render Map Section */}
      {showMapSearch && locationMode === 'map' && !showFavoritesOnly && (
        <div className="map-search-box">
          <DogMap
            locations={dogLocations}
            center={mapCenter}
            radiusKm={radiusKm}
            onMapClick={handleMapClick}
          />
          <div className="radius-controls">
            <label htmlFor="radius-slider">Radius: {radiusKm} km</label>
            <input
               id="radius-slider"
               type="range"
               min={1}
               max={50} 
               value={radiusKm}
               onChange={handleRadiusChange}
               className="radius-slider"
             />
             <button
               onClick={() => triggerRadiusSearch(mapCenter, radiusKm)}
               disabled={!mapCenter}
               className="radius-search-button"
              >
                Search This Area
              </button>
          </div>
        </div>
      )}

      {/* Use MatchSection component */}
      {!showFavoritesOnly && (
        <MatchSection 
          favoritesCount={favorites.length}
          onFindMatch={handleFindMatch}
        />
      )}

      {/* Use DogGrid component */}
      <DogGrid dogs={displayList} />

      {/* Use Pagination component */}
      {!showFavoritesOnly && (
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage} 
        />
      )}
    </div>
  );
};

export default SearchPage;
