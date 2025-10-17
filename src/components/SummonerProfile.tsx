// SummonerProfile.tsx (fragmento)

/* */

import { type SummonerProfileProps } from '../types/Props';
import React from 'react';
import SummonerIcon from './SummonerIcon';

// Asumimos que esta interfaz ya está definida en otro archivo.

const SummonerProfile: React.FC<SummonerProfileProps> = ({ data }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg bg-white">
      <SummonerIcon 
        iconUrl={data.profileIconUrl} // TS verifica que esto sea un string
        altText={`Icono de perfil de ${data.name}`} // TS verifica que esto sea un string
      />

      <div>
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <p className="text-gray-500">Nivel: {data.level}</p>
      </div>

    </div>
  );
};

export default SummonerProfile; 
