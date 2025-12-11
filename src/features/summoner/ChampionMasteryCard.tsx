import React from 'react';
import { type ChampionMastery } from '../../api/types/api';

interface ChampionMasteryCardProps {
  masteries: ChampionMastery[];
}

const ChampionMasteryCard: React.FC<ChampionMasteryCardProps> = ({ masteries }) => {
  // Tomamos el Top 4 para el grid horizontal
  const topMasteries = masteries ? masteries.slice(0, 4) : [];

  if (topMasteries.length === 0) return null;

  const formatPoints = (points: number) => {
    if (points >= 1000000) return (points / 1000000).toFixed(1) + 'M';
    if (points >= 1000) return (points / 1000).toFixed(0) + 'K';
    return points.toString();
  };

  const getMasteryCrestUrl = (level: number) => {
    const visualLevel = level > 7 ? 7 : level; 
    if (visualLevel < 1) return '';
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/mastery-${visualLevel}.png`;
  };

  return (
    <div className="bg-bg-surface rounded-lg shadow-lg p-4">
      <h3 className="text-text-muted text-xs font-bold uppercase mb-4 text-center tracking-widest border-b border-border-color pb-2">
        Top Maestrías
      </h3>
      
      {/* Grid de 4 columnas */}
      <div className="grid grid-cols-4 gap-3"> 
        
        {topMasteries.map((mastery) => (
          // Usamos 'gap-1' para controlar la separación vertical entre los 3 bloques
          <div key={mastery.championId} className="flex flex-col items-center gap-1 group">
            
            {/* === BLOQUE 1: ICONO + NIVEL (Badge integrado) === */}
            <div className="relative">
              <img 
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${mastery.championId}.png`}
                alt="Champion" 
                // Aumenté un poco el tamaño a w-14 (56px) para mayor presencia
                className="w-14 h-14 rounded-full border-2 border-bg-default shadow-sm"
              />
              {/* Badge de Nivel en la esquina inferior derecha */}
              <div className="absolute bottom-0 right-0 bg-bg-default rounded-full px-1.5 py-0.5 text-[10px] font-bold text-primary border border-border-color z-10 shadow-sm leading-none">
                 {mastery.championLevel}
              </div>
            </div>

            {/* === BLOQUE 2: EMBLEMA (Separado abajo) === */}
            {/* Margen negativo superior (-mt-2) para acercarlo al icono visualmente */}
            <div className="-mt-2 z-20"> 
               <img 
                  src={getMasteryCrestUrl(mastery.championLevel)} 
                  alt={`Maestría ${mastery.championLevel}`}
                  className="w-10 drop-shadow-md transition-transform group-hover:scale-110 duration-200"
               />
            </div>

            {/* === BLOQUE 3: PUNTOS === */}
            <div className="text-center -mt-1">
                <div className="text-xs font-bold text-text-base group-hover:text-primary transition-colors truncate">
                    {formatPoints(mastery.championPoints)}
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionMasteryCard;