// SummonerProfile.tsx (fragmento)

/* */

import { type SummonerProfileProps } from '../../api/types/props';
import React from 'react';
import SummonerIcon from './SummonerIcon';
import SummonerRank from './SummonerRank';

// Asumimos que esta interfaz ya está definida en otro archivo.

const SummonerProfile: React.FC<SummonerProfileProps> = ({ data }) => {
  return (
    <div className="p-6">
      
      {/* 1. SECCIÓN PRINCIPAL DE PERFIL */}
      <div className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-md">
        <SummonerIcon 
          iconUrl={data.profileIconUrl} 
          altText={`Icono de perfil de ${data.name}`} 
        />
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">{data.name}</h2>
          <p className="text-gray-500">Nivel: {data.level}</p>
        </div>
      </div>
      
      {/* 2. SECCIÓN DE RANGO */}
      <SummonerRank ranks={data.ranks} /> {/* 🛑 NUEVO USO DE COMPONENTE */}

    </div>
  );
};

export default SummonerProfile; 
