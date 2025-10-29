// src/pages/ProfilePage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ⬅️ useNavigate es crucial
import SummonerSearch from '../features/summoner/SummonerSearch'; 
import SearchForm from '../features/search/SearchForm'; // ⬅️ Importamos el formulario

// (La interfaz RouteParams se mantiene aquí)
interface RouteParams extends Record<string, string | undefined>{
    gameName: string | undefined; 
    tagLine: string | undefined;
    regionPlatform: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate(); // ⬅️ Hook para forzar la navegación
    const { gameName, tagLine, regionPlatform } = useParams<RouteParams>();

    // 🔑 CALLBACK DE NAVEGACIÓN: Se ejecuta cuando el SearchForm se usa en esta página
    const handleNewSearch = (gName: string, tLine: string, regionPlatform: string) => {
        // Al buscar un nuevo perfil, navegamos a la nueva URL.
        // Esto hace que ProfilePage se re-renderice con los nuevos parámetros, disparando un nuevo fetch.
        const profilePath = `/profile/${gName}/${tLine}/${regionPlatform}`;
        navigate(profilePath);
    };

    if (!gameName || !tagLine || !regionPlatform) {
        return <div className="text-red-500 mt-20">Error: Datos de perfil incompletos.</div>;
    }

    return (
        <div className="w-full bg-bg-surface max-w-4xl p-4 mt-10">
            
            {/* 🛑 NUEVA POSICIÓN: El SearchForm va arriba de la página de perfil */}
            <header className="mb-8 p-4 bg-bg-default shadow rounded-lg">
               <SearchForm onSearch={handleNewSearch} /> 
            </header>
            
            {/* 🎯 Motor de Lógica: Recibe los datos de la URL y se dispara automáticamente. */}
            <SummonerSearch initialGameName={gameName!} initialTagLine={tagLine!} initialRegionPlatform={regionPlatform!}/>
        </div>
    );
};

export default ProfilePage;