import type { 
  RiotSummonerResponse, 
  SummonerData, 
  RankData, 
  MatchData, 
  RiotMatchDetailResponse, 
  MatchParticipant
} from '../types/api';

const DDRAGON_VERSION = '15.24.1'; 

export const getDDragonChampionId = (championName: string): string => {
  if (championName === "FiddleSticks") {
    return "Fiddlesticks";
  }
  return championName.replace(/[^a-zA-Z0-9]/g, "");
};

export function mapRiotToSummonerData(
  riotProfileData: RiotSummonerResponse, 
  rawRankData: RankData[],
  rawMatchHistory: MatchData[],
  gameName: string,
  tagLine: string
): SummonerData {
  
  const profileIconUrl = 
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${riotProfileData.profileIconId}.png`;

  return {
    name: gameName,
    tagLine: tagLine,
    level: riotProfileData.summonerLevel,
    profileIconUrl: profileIconUrl,
    ranks: rawRankData,
    matchHistory: rawMatchHistory,
    masteries: [] 
  };
}

export function mapToMatchData(matchDetail: RiotMatchDetailResponse, puuid: string): MatchData | null {
  const participant = matchDetail.info.participants.find(p => p.puuid === puuid);

  if (!participant) {
    console.warn(`PUUID no encontrado en la partida ${matchDetail.metadata.matchId}.`);
    return null;
  }

  // ✅ CORRECCIÓN PRINCIPAL AQUÍ:
  const allParticipants: MatchParticipant[] = matchDetail.info.participants.map(p => {
    const champId = getDDragonChampionId(p.championName);
    return {
      puuid: p.puuid,
      // 1. Usamos el teamId real (100 o 200)
      teamId: p.teamId, 
      championName: p.championName,
      championIconUrl: `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${champId}.png`,
      // 2. Fallback seguro para el nombre
      gameName: p.riotIdGameName || p.summonerName, 
      // 3. Corregido el nombre de la propiedad RAW (riotIdTagline) vs tu propiedad (tagLine)
      tagLine: p.riotIdTagline || '', 
    };
  });

  const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`;
  const championIdForUrl = getDDragonChampionId(participant.championName);
  const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championIdForUrl}.png`;
  
  // Mapeo de Ítems
  const itemIds = [
    participant.item0, participant.item1, participant.item2,
    participant.item3, participant.item4, participant.item5, participant.item6
  ];

  const itemUrls = itemIds.map(id => {
    if (id === 0) return ""; 
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${id}.png`;
  });

  // Extraer Runas (Perks)
  const primaryStyle = participant.perks.styles[0]?.style;
  const subStyle = participant.perks.styles[1]?.style;

  return {
    matchId: matchDetail.metadata.matchId,
    gameDuration: matchDetail.info.gameDuration,
    gameEndTimestamp: matchDetail.info.gameEndTimestamp, 
    queueId: matchDetail.info.queueId,
    
    championName: participant.championName,
    championIconUrl: championIconUrl,
    champLevel: participant.champLevel,
    
    win: participant.win,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    kda: kda,
    items: itemUrls,
    
    summoner1Id: participant.summoner1Id,
    summoner2Id: participant.summoner2Id,
    perks: {
        primaryStyle: primaryStyle,
        subStyle: subStyle
    },
    // ✅ Agregamos la lista procesada de participantes
    participants: allParticipants
  }
}