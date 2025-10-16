import React from 'react';
import { useParams } from 'react-router-dom'; // ⬅️ Hook para leer la URL
import SummonerSearch from '../components/SummonerSearch'; 

// 1. Definimos la interfaz para los parámetros de la URL
// Los nombres deben coincidir con los de App.tsx: /profile/:gameName/:tagLine
interface RouteParams extends Record<string, string | undefined>{
    gameName: string | undefined
    tagLine: string | undefined;
}

const ProfilePage: React.FC = () => {
    // 2. Leemos los parámetros tipados de la URL
    // Usamos 'as RouteParams' para decirle a TS que la URL contiene esos campos
    const { gameName, tagLine } = useParams<RouteParams>();

    // 3. Renderizado Condicional de Composición
    // Si la URL no tiene los datos, no hacemos nada (aunque con el Route Path esto es raro)
    if (!gameName || !tagLine) {
        return <div className="text-red-500 mt-20">Error: Datos de perfil incompletos.</div>;
    }

    return (
        <div className="w-full max-w-4xl p-4 mt-10">
            {/* ⬅️ Aquí iría el SearchForm en pequeño, en un Header */}
            
            {/* 🎯 Motor de Lógica: Le pasamos los nombres que obtuvimos de la URL */}
            {/* SummonerSearch ahora puede iniciar el fetch inmediatamente con estos datos. */}
            <SummonerSearch initialGameName={gameName} initialTagLine={tagLine} />
            
            {/* El resto del contenido de las estadísticas */}
        </div>
    );
};

export default ProfilePage;