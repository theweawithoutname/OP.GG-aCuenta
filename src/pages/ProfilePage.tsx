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
                {/* Contenedor interno que se alinea con tu contenido 'max-w-4xl' */}
                <div className="w-full max-w-4xl">
                    <SearchForm onSearch={handleNewSearch} /> 
                </div>
            </header>
            
            {/* 2. CONTENIDO DE LA PÁGINA (Empujado hacia abajo) */}
            {/* Este div envuelve tu contenido y le da 'padding-top' para
                que no quede oculto detrás del navbar fijo.
                'pt-28' (112px) es un buen valor para un navbar con 'p-4' (ajusta si es necesario).
            */}
            <main className="w-full max-w-4xl mx-auto px-4 pt-28">
                {/* El 'bg-bg-surface' y 'p-4' que tenías en el div principal
                    ahora los aplicamos aquí, al contenedor del contenido.
                */}
                <div className="bg-bg-surface p-4 rounded-lg">
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