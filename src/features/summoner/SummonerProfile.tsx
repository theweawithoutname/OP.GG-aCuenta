import { type SummonerProfileProps } from '../../api/types/props';
import React from 'react';
import SummonerIcon from '../icons/SummonerIcon';
import SummonerRank from './SummonerRank';
import MatchHistoryList from './MatchHistoryList';

const SummonerProfile: React.FC<SummonerProfileProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-6 h-dvh bg-bg-default rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center p-6 rounded-lg bg-bg-surface text-center shadow-lg">
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
            {/* Etiquetas o info extra (simulado como en la imagen) */}
            <div className="mt-2 inline-block px-3 py-1 bg-bg-default rounded-full text-sm text-primary font-medium">
              Nivel: {data.level}
            </div>
          </div>
        </div>
        
        {/* B. Sección de Rangos */}
        <div className="bg-bg-surface rounded-lg shadow-lg overflow-hidden">
             <SummonerRank ranks={data.ranks || []} />
        </div>

      </div>

      {/* === COLUMNA DERECHA (CONTENIDO PRINCIPAL) === */}
      <div className="flex flex-col space-y-6">
        
        {/* Aquí podrías poner el gráfico de dona (Stats) en el futuro */}
        {/* <StatsSummary ... /> */}

        {/* C. Historial de Partidas */}
        {/* MatchHistoryList ahora ocupará todo el ancho disponible de esta columna */}
        <MatchHistoryList matches={data.matchHistory || []} />
      </div>

    </div>
  );
};

export default SummonerProfile;
