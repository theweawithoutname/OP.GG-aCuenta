import { type SummonerProfileProps } from '../../api/types/props';
import React, { useMemo } from 'react';
import { calculateStats } from '../../api/utils/statsCalculator';
import HistoryResume from './HistoryResume';
import SummonerIcon from '../icons/SummonerIcon';
import SummonerRank from './SummonerRank';
import MatchHistoryList from './MatchHistoryList';
import ChampionMasteryCard from './ChampionMasteryCard';
// 1. IMPORTAMOS EL ICONO DE REFRESCO
import { ArrowPathIcon } from '@heroicons/react/24/outline'; 

const SummonerProfile: React.FC<SummonerProfileProps> = ({ 
  data, 
  onLoadMore, 
  isLoadingMore, 
  isUpdating, 
  onUpdate    
}) => {

  const historyStats = useMemo(() => {
    return calculateStats(data.matchHistory || []);
  }, [data.matchHistory]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-6 min-h-full h-fit bg-bg-default rounded-lg">
      
      {/* === COLUMNA IZQUIERDA (SIDEBAR) === */}
      <div className="flex flex-col space-y-6">
        
        {/* TARJETA DE PERFIL */}
        {/* 2. AÑADIMOS 'relative' AQUÍ para posicionar el botón dentro */}
        <div className="relative flex flex-col items-center p-6 rounded-lg bg-bg-surface text-center shadow-lg">
          
          {/* 3. --- BOTÓN DE UPDATE (NUEVO) --- */}
          <button 
            onClick={onUpdate}
            disabled={isUpdating} // Deshabilita el click si ya está actualizando
            // Tooltip nativo simple al pasar el mouse
            title="Actualizar datos ahora"
            className={`
                absolute top-3 right-3 
                p-2 rounded-full 
                text-text-muted hover:text-primary hover:bg-bg-default 
                transition-all duration-300 border border-transparent hover:border-border-color

                ${isUpdating ? 'animate-spin text-primary cursor-not-allowed bg-bg-default border-border-color' : ''}
            `}
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>
          {/* --------------------------------- */}


          <div className="mb-4">
            <SummonerIcon 
              iconUrl={data.profileIconUrl} 
              altText={`Icono de perfil de ${data.name}`} 
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-extrabold text-text-base break-words">
              {data.name}
              <span className="text-text-muted font-normal text-lg ml-1">#{data.tagLine}</span>
            </h2> 
            <div className="mt-2 inline-block px-3 py-1 bg-bg-default rounded-full text-sm text-primary font-medium">
              Nivel: {data.level}
            </div>
          </div>
        </div>
        
        {/* Sección de Rangos */}
        <div className="bg-bg-surface rounded-lg shadow-lg overflow-hidden">
             <SummonerRank ranks={data.ranks || []} />
        </div>

        {data.masteries && (
             <ChampionMasteryCard masteries={data.masteries} />
         )}

      </div>

      {/* === COLUMNA DERECHA (HISTORIAL) === */}
      

      <div className="flex flex-col space-y-6">
        <HistoryResume stats={historyStats} />
        <MatchHistoryList 
            matches={data.matchHistory || []} 
            onLoadMore={onLoadMore} 
            isLoadingMore={isLoadingMore} 
        />
      </div>

    </div>
  );
};

export default SummonerProfile;