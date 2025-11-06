import { type MatchData } from '../../api/types/api';
import React from 'react';
import MatchHistoryItem from './MatchHistoryItem';

interface MatchHistoryListProps {
  matches: MatchData[];
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div className="mt-8 p-4 bg-bg-surface rounded-lg">
        <p className="text-text-muted italic text-center">
          No se encontraron partidas recientes en el historial.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* --- Título actualizado con colores del tema --- */}
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-border-color pb-2 text-text-base">
        Historial de Partidas ({matches.length})
      </h2>
      
      <div className="space-y-3">
        {matches.map(match => (
          <MatchHistoryItem 
            key={match.matchId}
            match={match}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchHistoryList;