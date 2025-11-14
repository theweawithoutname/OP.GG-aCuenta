// src/types/api.ts

/** 
 * *EN ESTE ARCHIVO SE DEFINE LA ESTRUCTURA DE DATOS ----> siguiente archivo: utils/dataMappers
 * ? 1-datos de la API
 * ? 2-datos que usare transformados desde la API
 * ? 3-datos genericos para gestionar el estado de la API
 * 
 * 1. La respuesta CRUDA que viene directamente de la API de Riot (Summoner-v4).
 */
export interface RiotSummonerResponse {
  id: string; 
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;  // <-- ID (number) de la API
  revisionDate: number;
  summonerLevel: number; // <-- Nombre largo de la API
}

export interface RankData {
  leagueId: string;
  queueType: string;    // Ej: "RANKED_SOLO_5x5" o "RANKED_FLEX_SR"
  tier: string;         // Ej: "DIAMOND", "GOLD"
  rank: string;         // Ej: "IV", "I"
  summonerId: string;
  leaguePoints: number; // LP
  wins: number;
  losses: number;
}

export interface MatchData {
  matchId: string;
  gameDuration: number; // Duración en segundos
  queueId: number;      // Tipo de cola (ej: 420 para SoloQ)
  championName: string; 
  championIconUrl: string;// Campeón jugado
  win: boolean;         // Resultado: Ganó (true) o Perdió (false)
  kills: number;
  deaths: number;
  assists: number;
  kda: string;          // Ratio KDA (lo calcularemos en el mapeador)
  items: string[];      // Array de IDs de ítems comprados
}

export interface MatchHistoryData {
  matches: MatchData[]; // Un array de las partidas individuales
}

export interface RiotMatchDetailResponse {
  info: {
    gameDuration: number;
    queueId: number;
    participants: {
      puuid: string;
      championName: string;
      win: boolean;
      kills: number;
      deaths: number;
      assists: number;
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;
    }[];
  };
  metadata: {
    matchId: string;
  };
}
/**
 * Define la respuesta mínima esperada de la API de Riot (ej: /summoner/v4/...).
 */
export interface SummonerData {
  name: string;
  level: number;
  profileIconUrl: string;
  ranks: RankData[];
  matchHistory: MatchData[];
}

/**
 * Tipo genérico para gestionar el estado de cualquier llamada a la API.
 */
export interface FetchState<T> {
  data: T | null; // Los datos (SummonerData) o null
  loading: boolean; // ¿Estamos esperando una respuesta?
  error: string | null; // Mensaje de error, si lo hay
}

export interface AccountDataResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

