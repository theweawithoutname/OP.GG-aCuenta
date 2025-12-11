// src/types/api.ts

/** * *EN ESTE ARCHIVO SE DEFINE LA ESTRUCTURA DE DATOS
 * ? 1-datos de la API
 * ? 2-datos que usare transformados desde la API
 * ? 3-datos genericos para gestionar el estado de la API
 */

export interface RiotSummonerResponse {
  id: string; 
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RankData {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

// Interfaz del Participante PROCESADO (para usar en el Frontend)
export interface MatchParticipant {
  puuid: string;
  teamId: number;       // 100 (Blue) o 200 (Red)
  championName: string;
  championIconUrl: string;
  gameName: string;     // ✅ CORREGIDO: Usamos nombres genéricos
  tagLine: string;      // ✅ CORREGIDO: Usamos nombres genéricos
}

export interface MatchData {
  matchId: string;
  gameDuration: number;
  queueId: number;
  championName: string; 
  championIconUrl: string;
  champLevel: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  items: string[];
  summoner1Id: number;
  summoner2Id: number;
  perks: {
    primaryStyle: number;
    subStyle: number;
  };
  gameEndTimestamp: number;
  participants: MatchParticipant[]; // ✅ Ahora usa la interfaz corregida de arriba
}

export interface MatchHistoryData {
  matches: MatchData[];
}

export interface ChampionMastery {
    championId: number;
    championLevel: number;
    championPoints: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    chestGranted: boolean;
    tokensEarned: number;
    summonerId: string;
}

export interface RiotPerkStyle {
  description: string;
  style: number;
  selections: {
    perk: number;
    var1: number;
    var2: number;
    var3: number;
  }[];
}

export interface RiotPerks {
  statPerks: {
    defense: number;
    flex: number;
    offense: number;
  };
  styles: RiotPerkStyle[];
}

// ⬇️ ESTA ES LA INTERFAZ CRUDA QUE VIENE DE RIOT
export interface RiotMatchDetailResponse {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    queueId: number;
    mapId: number;
    participants: {
      puuid: string;
      summonerName: string;
      
      // ✅ AGREGADO: Campos necesarios para el Riot ID y Equipos
      riotIdGameName?: string; // Puede ser opcional en cuentas viejas o bots
      riotIdTagline?: string;  // Nota: es 'Tagline' (l minúscula) en la API
      teamId: number;          // 100 o 200
      
      championName: string;
      champLevel: number;
      win: boolean;
      kills: number;
      deaths: number;
      assists: number;
      
      // Items
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;

      // Hechizos
      summoner1Id: number;
      summoner2Id: number;

      // Runas
      perks: RiotPerks;
      
      // Stats extra
      totalMinionsKilled: number;
      neutralMinionsKilled: number;
      visionScore: number;
    }[];
  };
}

export interface SummonerData {
  name: string;
  tagLine: string;
  level: number;
  profileIconUrl: string;
  ranks: RankData[];
  matchHistory: MatchData[];
  masteries: ChampionMastery[];
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface AccountDataResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}