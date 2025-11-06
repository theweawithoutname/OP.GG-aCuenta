// src/utils/dataMappers.ts

import type { RiotSummonerResponse, SummonerData, RankData, MatchData } from '../types/api';

const DDRAGON_VERSION = '14.20.1'; // Asegúrate de actualizar la versión

// 🛑 CORRECCIÓN: La función ahora acepta rawMatchHistory
export function mapRiotToSummonerData(
  riotProfileData: RiotSummonerResponse, 
  rawRankData: RankData[],
  rawMatchHistory: MatchData[] // ⬅️ Acepta el 3er argumento
): SummonerData {
  
  const profileIconUrl = 
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${riotProfileData.profileIconId}.png`;

  return {
    name: riotProfileData.name,
    level: riotProfileData.summonerLevel,
    profileIconUrl: profileIconUrl,
    ranks: rawRankData,
    
    // 🛑 CORRECCIÓN: Añadir el historial al objeto de retorno
    matchHistory: rawMatchHistory, 
  };
}
