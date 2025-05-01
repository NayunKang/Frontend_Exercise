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
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

const AppLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
      <Route path="/match/:id" element={<PrivateRoute><MatchPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
const App: React.FC = () => (
  <AuthProvider>
    <FavoritesProvider>
      <Router>
        <AppLayout />
      </Router>
    </FavoritesProvider>
  </AuthProvider>
);


export default App;
