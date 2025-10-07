// src/types/api.ts

/**
 * Define la respuesta mínima esperada de la API de Riot (ej: /summoner/v4/...).
 */
export interface SummonerData {
  id: string; // ID encriptada (para posteriores llamadas)
  name: string;
  profileIconId: number;
  summonerLevel: number;
  // ... añadir más propiedades según la documentación de Riot
}

/**
 * Tipo genérico para gestionar el estado de cualquier llamada a la API.
 */
export interface FetchState<T> {
  data: T | null; // Los datos (SummonerData) o null
  loading: boolean; // ¿Estamos esperando una respuesta?
  error: string | null; // Mensaje de error, si lo hay
}