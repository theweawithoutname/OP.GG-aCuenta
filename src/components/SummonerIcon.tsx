// SummonerIcon.tsx
/* 
  *COMPONENTE vISUAL DEL ICONO
  
*/

import React from 'react';
import {type SummonerIconProps } from '../types/Props';


const SummonerIcon: React.FC<SummonerIconProps> = ({ iconUrl, altText }) => {
  return (
    <img 
      src={iconUrl} 
      alt={altText}
      className="w-20 h-20 rounded-full border-4 border-yellow-500 shadow-lg object-cover"
    />
  );
};

export default SummonerIcon;