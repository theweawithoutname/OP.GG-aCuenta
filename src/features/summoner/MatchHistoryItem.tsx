import React from 'react';
import { type MatchData } from '../../api/types/api'; 
// Asumimos que también necesitarás una forma de obtener el ícono del campeón,
// pero por simplicidad usaremos solo el nombre.

interface MatchHistoryItemProps {
  match: MatchData;
}

const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({ match }) => {
  // Lógica para cambiar el color del fondo según el resultado
  const resultClass = match.win 
    ? 'bg-green-100 border-green-400' 
    : 'bg-red-100 border-red-400';

  // Función simple para formatear la duración de la partida (ej: 30:15)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={`p-4 flex items-center justify-between rounded-lg border-l-8 ${resultClass}`}>
      
      {/* Columna 1: Campeón y Resultado */}
      <div className="flex items-center space-x-3">
        {/* 💡 Aquí iría la imagen del campeón */}
        <div className="font-bold text-lg w-20">
            {match.win ? 'VICTORIA' : 'DERROTA'}
        </div>
        <div className="text-gray-700">
          <p className="font-semibold">{match.championName}</p>
          <p className="text-sm">Cola {match.queueId} - {formatDuration(match.gameDuration)}</p>
        </div>
      </div>
      
      {/* Columna 2: KDA */}
      <div className="text-center">
        <p className="font-mono text-gray-800">{match.kda}</p>
        <p className="text-xs text-gray-500">{match.kills}/{match.deaths}/{match.assists}</p>
      </div>

      {/* Columna 3: Ítems */}
      <div className="flex space-x-1">
        {/* 💡 Aquí se mostrarían los íconos de los ítems usando los IDs */}
        {match.items.map(( index) => (
            <div key={index} className="w-6 h-6 bg-gray-300 rounded-full text-xs flex items-center justify-center">
                {/* {itemId} */}
            </div>
        ))}
      </div>

    </div>
  );
};

export default MatchHistoryItem;