import { type MatchData } from '../types/api';

export interface ChampionStats {
  championName: string;
  iconUrl: string;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface HistoryStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  kdaRatio: string;
  topChampions: ChampionStats[];
}

export const calculateStats = (matches: MatchData[]): HistoryStats => {
  const totalGames = matches.length;
  if (totalGames === 0) {
    // Retorno por defecto si no hay partidas para evitar divisiones por cero
    return {
      totalGames: 0, wins: 0, losses: 0, winRate: 0,
      avgKills: 0, avgDeaths: 0, avgAssists: 0, kdaRatio: '0.00', topChampions: []
    };
  }

  let totalWins = 0;
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  
  // Diccionario para agrupar campeones: { "Ahri": { ...stats }, "Yasuo": { ...stats } }
  const champsMap: Record<string, ChampionStats> = {};

  // 1. ITERAR (El bucle principal)
  matches.forEach(match => {
    // Acumuladores globales
    if (match.win) totalWins++;
    totalKills += match.kills;
    totalDeaths += match.deaths;
    totalAssists += match.assists;

    // Estadísticas por Campeón
    const champName = match.championName;
    
    if (!champsMap[champName]) {
      // Inicializar si es la primera vez que lo vemos
      champsMap[champName] = {
        championName: champName,
        iconUrl: match.championIconUrl, // Necesitamos guardar la URL para pintarlo luego
        games: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
      };
    }

    // Sumar datos al campeón
    champsMap[champName].games++;
    if (match.win) champsMap[champName].wins++;
    champsMap[champName].kills += match.kills;
    champsMap[champName].deaths += match.deaths;
    champsMap[champName].assists += match.assists;
  });

  // 2. CALCULAR PROMEDIOS GLOBALES
  const losses = totalGames - totalWins;
  const winRate = Math.round((totalWins / totalGames) * 100);
  
  // KDA Ratio = (K + A) / D
  const kdaRatioNum = totalDeaths === 0 
    ? (totalKills + totalAssists) 
    : (totalKills + totalAssists) / totalDeaths;

  // 3. PROCESAR CAMPEONES (Convertir mapa a array y ordenar)
  const topChampions = Object.values(champsMap)
    .sort((a, b) => b.games - a.games) // Ordenar por más jugados
    .slice(0, 3); // Tomar solo el Top 3

  return {
    totalGames,
    wins: totalWins,
    losses,
    winRate,
    avgKills: parseFloat((totalKills / totalGames).toFixed(1)),
    avgDeaths: parseFloat((totalDeaths / totalGames).toFixed(1)),
    avgAssists: parseFloat((totalAssists / totalGames).toFixed(1)),
    kdaRatio: kdaRatioNum.toFixed(2),
    topChampions
  };
};