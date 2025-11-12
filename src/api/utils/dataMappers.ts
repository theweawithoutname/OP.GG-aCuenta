
import type { 
  RiotSummonerResponse, 
  SummonerData, 
  RankData, 
  MatchData, 
  RiotMatchDetailResponse // Necesitarás importar este tipo aquí
} from '../types/api';

// Esta constante ya la tienes aquí
const DDRAGON_VERSION = '14.20.1'; // Asegúrate de actualizar la versión

function getDDragonChampionId(apiName: string): string {
  const lowerApiName = apiName.toLowerCase();

  if (lowerApiName === "nautilus") {
    return "Nautilus";
  }

  if (lowerApiName === "seraphine") {
    return "Seraphine";
  }

  return apiName.replace(/[^a-zA-Z0-9]/g, '');
}

// Tu función de mapeo de perfil (actualizada para recibir gameName)
export function mapRiotToSummonerData(
  riotProfileData: RiotSummonerResponse, 
  rawRankData: RankData[],
  rawMatchHistory: MatchData[],
  gameName: string // ⬅️ ACEPTA EL gameName
): SummonerData {
  
  const profileIconUrl = 
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${riotProfileData.profileIconId}.png`;

  return {
    name: gameName, // ⬅️ ¡USA EL gameName!
    level: riotProfileData.summonerLevel,
    profileIconUrl: profileIconUrl,
    ranks: rawRankData,
    matchHistory: rawMatchHistory, 
  };
}

// --- NUEVO ---
// Movimos mapToMatchData aquí y la exportamos
// Ahora usa DDRAGON_VERSION para crear las URLs de los ítems
export function mapToMatchData(matchDetail: RiotMatchDetailResponse, puuid: string): MatchData | null {
  const participant = matchDetail.info.participants.find(p => p.puuid === puuid);

  if (!participant) {
    console.warn(`PUUID no encontrado en la partida ${matchDetail.metadata.matchId}.`);
    return null;
  }

  const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`;

  const championIdForUrl = getDDragonChampionId(participant.championName);

  const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championIdForUrl}.png`;
  // 1. Array de IDs de ítems
  const itemIds = [
    participant.item0, participant.item1, participant.item2,
    participant.item3, participant.item4, participant.item5, participant.item6
  ];

  // 2. Convertimos IDs a URLs usando DDRAGON_VERSION
  const itemUrls = itemIds.map(id => {
    if (id === 0) {
      return ""; // Slot vacío
    }
    // ¡Ahora puede ver la constante!
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${id}.png`;
  });

  return {
    matchId: matchDetail.metadata.matchId,
    gameDuration: matchDetail.info.gameDuration,
    queueId: matchDetail.info.queueId,
    championName: participant.championName,
    championIconUrl: championIconUrl,
    win: participant.win,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    kda: kda,
    items: itemUrls, // ⬅️ Ahora es un array de strings (URLs)
  }
}
