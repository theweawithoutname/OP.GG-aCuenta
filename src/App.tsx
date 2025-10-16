// src/App.tsx

import React from 'react';
import SummonerSearch from './components/SummonerSearch'; 


const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <SummonerSearch />
    </div>
  );
};

export default App;