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
/**
 * Define la respuesta mínima esperada de la API de Riot (ej: /summoner/v4/...).
 */
export interface SummonerData {
  name: string;
  level: number;
  profileIconUrl: string;
  ranks: RankData[];
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

