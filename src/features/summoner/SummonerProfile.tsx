

import { type SummonerProfileProps } from '../../api/types/props';
import React from 'react';
import SummonerIcon from '../icons/SummonerIcon';
import SummonerRank from './SummonerRank';
import MatchHistoryList from './MatchHistoryList';


const SummonerProfile: React.FC<SummonerProfileProps> = ({ data }) => {
  return (
    <div className="p-6 bg-bg-default rounded-lg">
      
      {/* 1. SECCIÓN PRINCIPAL DE PERFIL */}
      <div className="flex items-center space-x-4 p-4 rounded-lg bg-bg-surface">
        <SummonerIcon 
          iconUrl={data.profileIconUrl} 
          altText={`Icono de perfil de ${data.name}`} 
        />
        <div className='px-1.5'>
          <h2 className="text-[24px] font-extrabold text-text-base">{data.name}
            <span className="text-text-muted font-normal text-lg ml-1">#{data.tagLine}</span>
          </h2> 
          <p className="text-text-base">Nivel: {data.level}</p>
        </div>
      </div>
      
      {/* 2. SECCIÓN DE RANGO */}
      <SummonerRank ranks={data.ranks || []} />

      <MatchHistoryList matches={data.matchHistory || []} />

    </div>
  );
};

export default SummonerProfile; 
