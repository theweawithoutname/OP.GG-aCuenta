import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummonerSearch from '../features/summoner/SummonerSearch'; 
import SearchForm from '../features/search/SearchForm';

interface RouteParams extends Record<string, string | undefined>{
    gameName: string | undefined; 
    tagLine: string | undefined;
    regionPlatform: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { gameName, tagLine, regionPlatform } = useParams<RouteParams>();

    const handleNewSearch = (gName: string, tLine: string, regionPlatform: string) => {
        const profilePath = `/profile/${gName}/${tLine}/${regionPlatform}`;
        navigate(profilePath);
    };

    if (!gameName || !tagLine || !regionPlatform) {
        return <div className="text-red-500 mt-20">Error: Datos de perfil incompletos.</div>;
    }

    // Dividimos la página en dos partes: el navbar y el contenido
    return (
        <>
            {/* 1. NAVBAR FIJO (Solo para esta página) */}
            <header className="
                fixed top-0 left-0 right-0 z-50  /* Fija el header a la pantalla */
                flex justify-center             /* Centra el contenedor del form */
                p-4                             /* Padding */
                bg-bg-default                   /* Tu color de fondo de tema */
                shadow-lg                       /* Sombra para separarlo */
            ">
                <div className="w-full max-w-7xl flex justify-center">
                    <SearchForm onSearch={handleNewSearch} /> 
                </div>
            </header>
            <main className="w-full max-w-7xl mx-auto px-4">
                <div className="bg-bg-surface p-4 pb-0 pt-28 min-h-full">
                    <SummonerSearch 
                        initialGameName={gameName!} 
                        initialTagLine={tagLine!} 
                        initialRegionPlatform={regionPlatform!}
                    />
                </div>
            </main>
        </>
    );
};

export default ProfilePage;