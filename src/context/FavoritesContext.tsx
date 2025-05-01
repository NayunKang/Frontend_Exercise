import React, {
    createContext,
    useContext,
    useState,
    useEffect,
  } from 'react';
  
  interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (id: string) => void;
  }
  
  const FavoritesContext = createContext<FavoritesContextType | undefined>(
    undefined
  );
  
  export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [favorites, setFavorites] = useState<string[]>(() => {
      try {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
      } catch {
        return [];
      }
    });
  
    useEffect(() => {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);
  
    const toggleFavorite = (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
      );
    };
  
    return (
      <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
        {children}
      </FavoritesContext.Provider>
    );
  };
  
  export const useFavorites = (): FavoritesContextType => {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider');
    return ctx;
  };
  