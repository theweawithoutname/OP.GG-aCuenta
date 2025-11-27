import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // 1. Importa useLocation
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import TopLoader from './features/search/TopLoader'; // 2. Importa tu componente de barra

const App: React.FC = () => {
  const location = useLocation(); // Detecta en qué ruta estamos
  const [isNavigating, setIsNavigating] = useState(false);

  // 3. Efecto: Cada vez que cambia la ruta (location), activamos la barra
  useEffect(() => {
    setIsNavigating(true);

    // La desactivamos después de un breve tiempo para simular la carga
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 800); // 800ms de animación

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="
      w-full min-h-dvh bg-bg-default flex justify-center
      scrollbar-thin scrollbar-thumb-primary scrollbar-track-bg-surface
    ">
      
      {/* 4. Renderizamos la barra si estamos navegando */}
      {isNavigating && <TopLoader />}

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/profile/:gameName/:tagLine/:regionPlatform" element={<ProfilePage />}/>
      </Routes>
    </div>
  );
};

export default App;