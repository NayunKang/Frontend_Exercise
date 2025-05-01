const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const getBreeds = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/dogs/breeds`, { credentials: 'include' });
  return res.json();
};

export const searchDogs = async ({
    breed,
    sort,
    size,
    from,
    ageMin,
    ageMax,
    zipCode,
  }: {
    breed?: string;
    sort: 'asc' | 'desc';
    size: number;
    from: number;
    ageMin?: number;
    ageMax?: number;
    zipCode?: string;
  }) => {
    const query = new URLSearchParams();
    if (breed)    query.append('breeds', breed);
    if (zipCode)  query.append('zipCodes', zipCode);
    if (ageMin !== undefined) query.append('ageMin', ageMin.toString());
    if (ageMax !== undefined) query.append('ageMax', ageMax.toString());
    query.append('sort', `breed:${sort}`);
    query.append('size', size.toString());
    query.append('from', from.toString());
  
    const res = await fetch(`${BASE_URL}/dogs/search?${query.toString()}`, {
      credentials: 'include',
    });
    return res.json();
  };

export const getDogsByIds = async (ids: string[]) => {
  const res = await fetch(`${BASE_URL}/dogs`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  });
  return res.json();
};

export const findMatch = async (ids: string[]): Promise<{ match: string }> => {
    const res = await fetch(`${BASE_URL}/dogs/match`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ids),
    });
    if (!res.ok) throw new Error('Failed to generate match');
    return res.json();
  };