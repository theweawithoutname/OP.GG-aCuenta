import { type MatchData } from '../../api/types/api';
import React from 'react';
import MatchHistoryItem from './MatchHistoryItem';

interface MatchHistoryListProps {
  matches: MatchData[];
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <p className="mt-8 text-gray-500 italic">
        No se encontraron partidas recientes en el historial.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Historial de Partidas ({matches.length})</h2>
      
      <div className="space-y-3">
        {/* 🚀 Iteración sobre el array de partidas limpias */}
        {matches.map(match => (
          <MatchHistoryItem 
            key={match.matchId} // Clave única para la lista
            match={match}       // Pasa el objeto MatchData completo al hijo
          />
        ))}
      </div>
    </div>
  );
};

export default MatchHistoryList;