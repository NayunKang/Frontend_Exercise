import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './screens/LoginPage/LoginPage';
import SearchPage from './screens/SearchPage/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
