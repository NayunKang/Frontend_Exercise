import { Location } from '../types/Locations';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
    bottom_right?: Coordinates;
    top_right?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export const searchLocations = async (
  params: LocationSearchParams
): Promise<LocationSearchResponse> => {
  const res = await fetch(
    'https://frontend-take-home-service.fetch.com/locations/search',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }
  );
  if (!res.ok) {
    throw new Error(`Location search failed (${res.status})`);
  }
  return res.json();
};

export const getLocationsByZips = async (
  zipCodes: string[]
): Promise<Location[]> => {
  const res = await fetch(
    'https://frontend-take-home-service.fetch.com/locations',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zipCodes.slice(0, 100)),
    }
  );
  if (!res.ok) {
    throw new Error(`ZIP lookup failed (${res.status})`);
  }
  return res.json();
};