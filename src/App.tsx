// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';


const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/profile/:gameName/:tagLine/:regionPlatform" element={<ProfilePage />}/>
      </Routes>
    </div>
  );
};

export default App;