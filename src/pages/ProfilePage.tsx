// src/pages/ProfilePage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ⬅️ useNavigate es crucial
import SummonerSearch from '../components/SummonerSearch'; 
import SearchForm from '../components/SearchForm'; // ⬅️ Importamos el formulario

// (La interfaz RouteParams se mantiene aquí)
interface RouteParams extends Record<string, string | undefined>{
    gameName: string | undefined; 
    tagLine: string | undefined;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate(); // ⬅️ Hook para forzar la navegación
    const { gameName, tagLine } = useParams<RouteParams>();

    // 🔑 CALLBACK DE NAVEGACIÓN: Se ejecuta cuando el SearchForm se usa en esta página
    const handleNewSearch = (gName: string, tLine: string) => {
        // Al buscar un nuevo perfil, navegamos a la nueva URL.
        // Esto hace que ProfilePage se re-renderice con los nuevos parámetros, disparando un nuevo fetch.
        const profilePath = `/profile/${gName}/${tLine}`;
        navigate(profilePath);
    };

    if (!gameName || !tagLine) {
        return <div className="text-red-500 mt-20">Error: Datos de perfil incompletos.</div>;
    }

    return (
        <div className="w-full max-w-4xl p-4 mt-10">
            
            {/* 🛑 NUEVA POSICIÓN: El SearchForm va arriba de la página de perfil */}
            <header className="mb-8 p-4 bg-white shadow rounded-lg">
               <SearchForm onSearch={handleNewSearch} /> 
            </header>
            
            {/* 🎯 Motor de Lógica: Recibe los datos de la URL y se dispara automáticamente. */}
            <SummonerSearch initialGameName={gameName} initialTagLine={tagLine} />
        </div>
    );
};

export default ProfilePage;