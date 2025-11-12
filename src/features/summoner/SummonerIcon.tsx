// SummonerIcon.tsx
/* 
  *COMPONENTE VISUAL DEL ICONO
  *SummonerIcon ------> SummonerProfile
*/

import React from 'react';
import {type SummonerIconProps } from '../../api/types/props';


const SummonerIcon: React.FC<SummonerIconProps> = ({ iconUrl, altText }) => {
  return (
    <img 
      src={iconUrl} 
      alt={altText}
      className="w-20 h-20 rounded-full border-4 border-primary shadow-lg object-cover"
    />
  );
};

export default SummonerIcon;