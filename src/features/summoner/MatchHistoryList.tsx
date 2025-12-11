import { type MatchData } from '../../api/types/api';
import React from 'react';
import MatchHistoryItem from './MatchHistoryItem';

interface MatchHistoryListProps {
  matches: MatchData[];
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({ matches, onLoadMore, isLoadingMore }) => {
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
    <div>
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
<div className="pt-2"> {/* Un poco de padding extra arriba */}
            <button
            onClick={onLoadMore}
            disabled={isLoadingMore} // Deshabilitar si está cargando
            className={`
                w-full p-4  /* Ancho completo y padding igual que las cards */
                rounded-lg
                font-semibold text-text-base
                transition-all duration-200
                border border-border-color
                flex justify-center items-center gap-2 /* Para centrar texto e icono */
                
                ${isLoadingMore 
                    ? 'bg-bg-default cursor-not-allowed opacity-70'
                    : 'bg-bg-surface hover:bg-bg-muted hover:border-primary cursor-pointer shadow-lg'
                }
            `}
            >
            {isLoadingMore ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cargando partidas...</span>
                </>
            ) : (
                <span>Cargar más partidas</span>
            )}
            </button>
        </div>
    </div>
  );
};

export default MatchHistoryList;