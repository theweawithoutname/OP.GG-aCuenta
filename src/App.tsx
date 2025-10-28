// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';


const App: React.FC = () => {
  return (
    <div className="
            min-h-screen p-6 bg-bg-default flex justify-center            
            scrollbar-thin
            scrollbar-thumb-primary 
            scrollbar-track-bg-surface">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/profile/:gameName/:tagLine/:regionPlatform" element={<ProfilePage />}/>
      </Routes>
    </div>
  );
};

export default App;