// src/pages/HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchForm from '../features/search/SearchForm';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (gameName: string, tagLine: string, region: string) => {
    // 3. NAVEGACIÓN: Redirige al usuario a la nueva URL de perfil
    // Esto coincide con el patrón definido en App.tsx: /profile/:gameName/:tagLine
    const profilePath = `/profile/${gameName}/${tagLine}/${region}`;
    navigate(profilePath);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Riot ID Stats Tracker
      </h1>
      <SearchForm onSearch={handleSearch} />
    </div>
  );
};

export default HomePage;