import { Dog } from '../types/Dog';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export interface DogSearchParams {
  breed?: string;
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  sort: 'asc' | 'desc';
  size: number;
  from: number;
}

export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export const getBreeds = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/dogs/breeds`, { credentials: 'include' });
  return res.json();
};

export async function searchDogs(
  params: DogSearchParams
): Promise<DogSearchResponse> {
  const q = new URLSearchParams();

  if (params.breed) {
    q.append('breeds', params.breed);
  }
  if (params.zipCodes) {
    params.zipCodes.forEach((z) => q.append('zipCodes', z));
  }
  if (params.ageMin != null) {
    q.append('ageMin', params.ageMin.toString());
  }
  if (params.ageMax != null) {
    q.append('ageMax', params.ageMax.toString());
  }

  // always include sort, size, from
  q.append('sort', `breed:${params.sort}`);
  q.append('size', params.size.toString());
  q.append('from', params.from.toString());

  console.debug('🐾 Fetching dogs with params:', q.toString());
  const res = await fetch(`${BASE_URL}/dogs/search?${q.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Dog search failed: ${res.status}`);
  }
  return res.json();
}

export const getDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const res = await fetch(`${BASE_URL}/dogs`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  });
  if (!res.ok) {
    throw new Error(`Fetching dogs failed: ${res.status}`);
  }
  return res.json();
};

export const findMatch = async (
  ids: string[]
): Promise<{ match: string }> => {
  const res = await fetch(`${BASE_URL}/dogs/match`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  });
  if (!res.ok) {
    throw new Error('Failed to generate match');
  }
  return res.json();
};
