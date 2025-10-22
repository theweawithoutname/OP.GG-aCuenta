// src/components/SummonerSearch.tsx

/* 
  *FUNCIONA COMO INTERMEDIARIO ENTRE LA CAPA VISUAL Y LA API, gestionando errores, cargas y la llamada a la API

  * SummonerSearch -----> types/props 



*/
import React, { useState, useEffect } from 'react';
import type { FetchState, RankData, SummonerData, RiotSummonerResponse } from '../types/api';
import { mapRiotToSummonerData } from '../utils/dataMappers';

// Importaciones de Contratos (Componentes de Presentación que usaremos después)
import SummonerProfile from './SummonerProfile';
//import SearchForm from './SearchForm';
import KataLoading from '../assets/KataLoading.gif'

const REGION_PLATFORM= 'la2';
const REGION_GLOBAL= 'americas';
const ACCOUNT_V1_URL = `https://${REGION_GLOBAL}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`;
const SUMMONER_V4_URL = `https://${REGION_PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;
const LEAGUE_V4_URL = `https://${REGION_PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-puuid/`;

export interface SummonerSearchProps {
  initialGameName: string;
  initialTagLine: string;
}

const SummonerSearch: React.FC<SummonerSearchProps> = ({initialGameName, initialTagLine}) => {
  const [fetchState, setFetchState] = useState<FetchState<SummonerData>>({
    data: null,
    loading: false,
    error: null,
  });
  
useEffect(() => {
    // 1. Condición de Salida: Se usa initialGameName/TagLine directamente.
    if (!initialGameName || !initialTagLine) return; 

    const fetchSummoner = async () => {
        // A. INICIO: Establecer el estado de carga
        setFetchState({ data: null, loading: true, error: null });
        const apiKey = import.meta.env.VITE_RIOT_API_KEY; 

        try {
            // ------------------------------------------------------------------
            // FASE 1: OBTENER PUUID (API Account-V1 - Global)
            // ------------------------------------------------------------------
            const encodedGameName = encodeURIComponent(initialGameName);
            const encodedTagLine = encodeURIComponent(initialTagLine);

            const accountUrl = `${ACCOUNT_V1_URL}${encodedGameName}/${encodedTagLine}?api_key=${apiKey}`;
            const accountResponse = await fetch(accountUrl);

            if (!accountResponse.ok) {
                const errorMsg = accountResponse.status === 404 
                    ? `Riot ID "${initialGameName}#${initialTagLine}" no encontrado.`
                    : `Error en la API de Cuenta: ${accountResponse.status} (${accountResponse.statusText})`;
                throw new Error(errorMsg);
            }

            const accountData: { puuid: string } = await accountResponse.json();
            const puuid = accountData.puuid;

            // ------------------------------------------------------------------
            // FASE 2: OBTENER PERFIL BÁSICO (API Summoner-V4 - Plataforma)
            // ------------------------------------------------------------------
            const summonerUrl = `${SUMMONER_V4_URL}${puuid}?api_key=${apiKey}`;
            const summonerResponse = await fetch(summonerUrl);
            
            if (!summonerResponse.ok) {
                throw new Error(`Error en la API de Perfil: ${summonerResponse.status}`);
            }
            
            const rawProfileData: RiotSummonerResponse = await summonerResponse.json();

            // ------------------------------------------------------------------
            // FASE 3: OBTENER DATOS DE RANGO (API League-V4 - Plataforma)
            // ------------------------------------------------------------------
            const leagueUrl = `${LEAGUE_V4_URL}${puuid}?api_key=${apiKey}`;
            const leagueResponse = await fetch(leagueUrl);

            if (!leagueResponse.ok) {
                // Nota: Los jugadores NO rankeados a menudo devuelven 404. Riot lo trata como fallo.
                if (leagueResponse.status === 404) {
                    // Si el jugador no tiene rank, devolvemos un array vacío para que el mapeador no falle.
                    // Pero la lógica de tu if (!leagueResponse.ok) lo atraparía, así que lo dejamos fallar.
                    throw new Error(`Error en la API de Liga: ${leagueResponse.status}. (Jugador no rankeado o error)`);
                }
                throw new Error(`Error en la API de Liga: ${leagueResponse.status}`);
            }
            
            const rawRankData: RankData[] = await leagueResponse.json();
            
            // ------------------------------------------------------------------
            // FASE 4: CONSOLIDACIÓN Y ÉXITO
            // --------------------------------------------------
            const transformedData = mapRiotToSummonerData(rawProfileData, rawRankData); 

            setFetchState({ data: transformedData, loading: false, error: null });

        } catch (e) {
            // C. ERROR: Gestión del error y actualización del estado
            const errorMessage = e instanceof Error ? e.message : 'Error de red desconocido.';
            setFetchState({ data: null, loading: false, error: errorMessage });
        }
    };

    fetchSummoner(); 
// 🛑 DEPENDENCIAS: El fetch se ejecuta si la URL (props) cambia.
}, [initialGameName, initialTagLine]);
  
  // ----------------------------------------------------------------------
  
  // 4. RENDERIZADO (Contratos de Flujo)

  return (
    <div className="p-8 max-w-lg mx-auto">
      {/* 🔴 CONTRATO ARRIBA: Pasa la función de control al hijo (SearchForm) */}

      {/* 🟡 RENDERIZADO CONDICIONAL: Muestra un mensaje mientras carga */}
      {fetchState.loading && 
      <div className='flex justify-center'>
        <img src={KataLoading} alt="Cargando perfil..."/>
      </div>}

      {/* 🟢 CONTRATO ABAJO: Pasa los datos limpios al hijo (SummonerProfile) */}
      {fetchState.data && (
        <div className="mt-6">
          <SummonerProfile data={fetchState.data} /> 
        </div>
      )}

      {/* 🔴 Muestra el Error */}
      {fetchState.error && (
        <p className="mt-6 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          {fetchState.error}
        </p>
      )}
    </div>
  );
};

export default SummonerSearch;