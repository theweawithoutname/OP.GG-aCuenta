import React from 'react';
import { type HistoryStats } from '../../api/utils/statsCalculator';

interface HistoryResumeProps {
  stats: HistoryStats;
}

const HistoryResume: React.FC<HistoryResumeProps> = ({ stats }) => {
  // Colores dinámicos para el Winrate
  const winRateColor = stats.winRate >= 50 ? 'text-accent-win' : 'text-accent-loss';
  // Borde dinámico para el gráfico de dona (simulado con borde)
  const borderColor = stats.winRate >= 50 ? 'border-accent-win' : 'border-accent-loss';

  return (
    <div className="bg-bg-surface rounded-lg p-4 shadow-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-border-color">
      
      {/* 1. WINRATE GLOBAL */}
      <div className="flex flex-col justify-center items-center p-2">
        <p className="text-text-muted text-sm font-bold mb-2">
            {stats.totalGames} Partidas ({stats.wins}V - {stats.losses}D)
        </p>
        <div className={`relative w-24 h-24 rounded-full border-8 ${borderColor} flex items-center justify-center`}>
            {/* Aquí podrías usar una librería de Charts real, pero un borde simple funciona por ahora */}
            <span className={`text-2xl font-extrabold ${winRateColor}`}>
                {stats.winRate}%
            </span>
        </div>
      </div>

      {/* 2. KDA PROMEDIO */}
      <div className="flex flex-col justify-center items-center p-2 space-y-2">
        <h3 className="text-text-muted text-sm uppercase font-bold">KDA Promedio</h3>
        <div className="text-2xl font-bold text-text-base">
            <span>{stats.avgKills}</span> / <span className="text-accent-loss">{stats.avgDeaths}</span> / <span>{stats.avgAssists}</span>
        </div>
        <div className="text-lg font-extrabold text-text-muted">
            {stats.kdaRatio}:1 <span className="text-xs font-normal text-accent-win">(KDA)</span>
        </div>
      </div>

      {/* 3. TOP CAMPEONES */}
      <div className="flex flex-col justify-center p-2">
        <h3 className="text-text-muted text-sm uppercase font-bold mb-3 text-center md:text-left">Campeones Más Jugados</h3>
        <div className="space-y-2">
            {stats.topChampions.map((champ) => {
                const champWinRate = Math.round((champ.wins / champ.games) * 100);
                const wrColor = champWinRate >= 50 ? 'text-accent-win' : 'text-accent-loss';
                
                return (
                    <div key={champ.championName} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <img src={champ.iconUrl} alt={champ.championName} className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm font-bold text-text-base">{champ.championName}</span>
                        </div>
                        <div className="text-xs text-right">
                            <div className={wrColor}>{champWinRate}% WR</div>
                            <div className="text-text-muted">({champ.wins}V - {champ.games - champ.wins}D)</div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

    </div>
  );
};

export default HistoryResume;