import React from 'react';
import { type MatchData } from '../../api/types/api'; 
import ItemIcon from './ItemIcon';
import ChampionIcon from './ChampionIcon';

interface MatchHistoryItemProps {
  match: MatchData;
}

const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({ match }) => {
  
  const resultBorderClass = match.win 
    ? 'border-accent-win' 
    : 'border-accent-loss';

  const resultTextClass = match.win
    ? 'text-accent-win'
    : 'text-accent-loss';

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    // --- Contenedor Principal (GRID de 4 Columnas) ---
    <div className={`
      p-4 
      bg-bg-surface rounded-lg 
      border-l-4 ${resultBorderClass} 
      shadow-lg
      
      grid grid-cols-[100px_140px_100px_1fr] gap-x-4 items-center
    `}>
      {/* Definición de las columnas:
        - Col 1 (Resultado): 100px
        - Col 2 (Info Champ): 140px
        - Col 3 (KDA): 100px
        - Col 4 (Items): 1fr (ocupa todo el espacio sobrante)
      */}
      
      {/* --- Columna 1: Resultado --- */}
      <div className={`font-bold text-lg ${resultTextClass}`}>
        {match.win ? 'VICTORIA' : 'DERROTA'}
      </div>
      
      {/* --- Columna 2: Info de Partida --- */}
      <div className="flex items-center space-x-2 text-text-base"> {/* Usamos flex para el ícono y texto */}
        <ChampionIcon 
          iconUrl={match.championIconUrl} 
          altText={match.championName} 
          size="medium" // Puedes ajustar el tamaño aquí
        />
        <div> {/* Este div contendrá el KDA y la duración */}
          <p className="font-semibold whitespace-nowrap">{match.kda}</p> {/* Mueve el KDA aquí */}
          <p className="text-sm text-text-muted">
            {match.queueId} - {formatDuration(match.gameDuration)}
          </p>
        </div>
      </div>
      
      {/* --- Columna 3: KDA --- */}
      <div className="text-center">
        <p className="font-mono text-text-base whitespace-nowrap">{match.kda}</p>
        <p className="text-xs text-text-muted">{match.kills}/{match.deaths}/{match.assists}</p>
      </div>

      {/* --- Columna 4: Ítems (GRID de 7 Columnas) --- */}
      {/* Usamos 'grid-cols-7' para forzar 7 columnas para los 7 ítems.
        'justify-end' alinea toda la cuadrícula de ítems a la derecha.
      */}
      <div className="grid grid-cols-7 gap-0.5 justify-end">
        {match.items.map((itemUrl, index) => (
          <ItemIcon 
            key={index}
            iconUrl={itemUrl}
            altText={`Ítem ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default MatchHistoryItem;