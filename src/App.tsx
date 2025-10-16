// src/App.tsx

import React from 'react';
// Importamos el componente de lógica principal
import SummonerSearch from './components/SummonerSearch'; 

// Ya no necesitamos importar './index.css' aquí si ya lo importamos en main.tsx

const App: React.FC = () => {
  return (
    // 🎨 Layout principal: Un contenedor centrado para toda la aplicación
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      
      {/* ➡️ Composición Principal: Inyectamos el motor de la aplicación */}
      {/* El componente SummonerSearch contiene SearchForm, lógica y SummonerProfile. */}
      <SummonerSearch />
      
    </div>
  );
};

export default App;