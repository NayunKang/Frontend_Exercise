import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import LoginPage from './screens/LoginPage/LoginPage';
import SearchPage from './screens/SearchPage/SearchPage';
import MatchPage from './screens/MatchPage/MatchPage'; 

const AppLayout: React.FC = () => {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/match/:id" element={<MatchPage />} />      
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <FavoritesProvider>
    <Router>
      <AppLayout />
    </Router>
  </FavoritesProvider>
);

export default App;
