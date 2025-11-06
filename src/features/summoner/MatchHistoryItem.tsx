import React from 'react';
import { type MatchData } from '../../api/types/api'; 

interface MatchHistoryItemProps {
  match: MatchData;
}

const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({ match }) => {
  
  // --- Lógica de clases actualizada para usar tu paleta de acentos ---
  const resultBorderClass = match.win 
    ? 'border-accent-win'   // Usa tu variable CSS --color-accent-win
    : 'border-accent-loss'; // Usa tu variable CSS --color-accent-loss

  const resultTextClass = match.win
    ? 'text-accent-win'
    : 'text-accent-loss';

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    // --- Contenedor principal actualizado ---
    <div className={`
      p-4 flex items-center justify-between 
      bg-bg-surface rounded-lg 
      border-l-4 ${resultBorderClass} 
      shadow-lg
    `}>
      
      {/* Columna 1: Campeón y Resultado */}
      <div className="flex items-center space-x-3">
        {/* 💡 Aquí iría la imagen del campeón */}

        {/* --- Texto de Resultado actualizado --- */}
        <div className={`font-bold text-lg w-24 ${resultTextClass}`}>
            {match.win ? 'VICTORIA' : 'DERROTA'}
        </div>
        
        {/* --- Textos de Info actualizados --- */}
        <div className="text-text-base">
          <p className="font-semibold">{match.championName}</p>
          <p className="text-sm text-text-muted">
            {/* TODO: Mapear queueId a un nombre (Ej: "Ranked Solo") */}
            {match.queueId} - {formatDuration(match.gameDuration)}
          </p>
        </div>
      </div>
      
      {/* Columna 2: KDA (Textos actualizados) */}
      <div className="text-center">
        <p className="font-mono text-text-base">{match.kda}</p>
        <p className="text-xs text-text-muted">{match.kills}/{match.deaths}/{match.assists}</p>
      </div>

      {/* Columna 3: Ítems (Placeholder actualizado) */}
      <div className="flex space-x-1">
        {/* Corregido el map: usamos '_' para el item que no usamos y 'index' para la key */}
        {match.items.map((_, index) => (
            <div 
              key={index} 
              // --- Placeholder usa 'bg-bg-default' (el fondo de la página) ---
              className="w-6 h-6 bg-bg-default rounded"
            >
                {/* Aquí iría la <img> del ítem */}
            </div>
        ))}
      </div>

    </div>
  );
};

export default MatchHistoryItem;