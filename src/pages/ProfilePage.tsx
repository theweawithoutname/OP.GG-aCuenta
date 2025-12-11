import React from 'react';
// 1. Añadimos 'Link' a los imports
import { useParams, useNavigate, Link } from 'react-router-dom';
import SummonerSearch from '../features/summoner/SummonerSearch'; 
import SearchForm from '../features/search/SearchForm';
import Portada from '../assets/Portada.svg';

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

    return (
        <>
            <header className="
                fixed top-0 left-0 right-0 z-50
                flex items-center justify-center
                p-4
                bg-bg-default
                shadow-lg
            ">
                <Link to="/" className="flex-shrink-0 mr-6">
                    <img 
                        src={Portada} 
                        alt="Ir al inicio" 
                        className='w-36 cursor-pointer hover:opacity-80 transition-opacity' 
                    />
                </Link>

                <div className="w-full max-w-7xl flex justify-center">
                    <SearchForm onSearch={handleNewSearch} /> 
                </div>
            </header>

<main className="w-full max-w-7xl mx-auto px-4">
    <div className="
            relative
            bg-bg-surface 
            pt-32 pb-20 px-4
            w-full
            min-h-[calc(100vh-2rem)]
            flex flex-col gap-4
        ">
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