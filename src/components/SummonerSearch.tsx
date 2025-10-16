// src/components/SummonerSearch.tsx

/* 
  *FUNCIONA COMO INTERMEDIARIO ENTRE LA CAPA VISUAL Y LA API, gestionando errores, cargas y la llamada a la API
  ? importa los hooks, las interfaces y el traductor
  ? crea el estado del fetch integrando SummonerData y creo el estado de SummonerName
  ? handleSearch tomara el nombre que demos en la interfaz visual y cambiara el estado de SummonerName
  ? al cambiar el estado de SummonerName, se activa el efecto secundario que hace lo siguiente:
    ? - resetea el estado del fetch
    ? - inicia el try esperando a la red
    ? - si la red falla fuerza un error
    ? - sino falla, espera los datos de la API en crudo
    ? - transforma los datos de la API con la funcion del dataMapper
    ? - define los datos del fetch como los datos transformados
    ! en caso de haber un error desconocido hay un catch por defecto
  ? si hay datos se genera el SummonerProfile con los datos del fetch
  ? si fetch esta en loading se genera un P con texto cargando
  ? si hay un error se genera el P con el error

  * SummonerSearch -----> types/props 



*/
import React, { useState, useEffect } from 'react';
// IMPORTACIONES: Traemos los Contratos y el Traductor
import type { FetchState, SummonerData } from '../types/api';
import { mapRiotToSummonerData } from '../utils/dataMappers';

// Importaciones de Contratos (Componentes de Presentación que usaremos después)
import SummonerProfile from '../SummonerProfile';
import SearchForm from './SearchForm';

import KataLoading from '../assets/KataLoading.gif'

const REGION_PLATFORM= 'la2';
const REGION_GLOBAL= 'americas';

const ACCOUNT_V1_URL = `https://${REGION_GLOBAL}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`;
const SUMMONER_V4_URL = `https://${REGION_PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;

const SummonerSearch: React.FC = () => {
  // 1. ESTADO DE LA BÚSQUEDA (El Registro de la Lógica)
  
  // fetchState: Guarda el resultado del fetch (datos, carga, error) usando el tipo limpio SummonerData.
  const [fetchState, setFetchState] = useState<FetchState<SummonerData>>({
    data: null,
    loading: false,
    error: null,
  });
  
  // summonerName: Guarda el nombre que dispara la búsqueda. Este es el 'input' del useEffect.
  const [gameName, setGameName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');
  
  // ----------------------------------------------------------------------
  
  // 2. FUNCIÓN DE ACCIÓN ASCENDENTE (Contrato para el Hijo)

  // handleSearch es el *callback* que le pasaremos al SearchForm (el hijo).
  // Es la única forma en que el hijo puede comunicarse con la lógica del padre.
  const handleSearch = (gName: string, tLine: string) => {
    // Al ser llamada por el formulario, actualiza el estado,
    // lo cual, a su vez, activa el useEffect (el fetch).
    setGameName(gName);
    setTagLine(tLine);
  };
  
  // ----------------------------------------------------------------------
  
  // 3. EFECTO SECUNDARIO (El Motor de la API)

  useEffect(() => {
    // Si el nombre está vacío (ej. al inicio), salimos sin hacer nada.
    if (!gameName || !tagLine) return; 

    const fetchSummoner = async () => {
      // INICIO: Activar carga y limpiar errores/datos anteriores.
      setFetchState({ data: null, loading: true, error: null });

      try {
        // Lógica de la llamada
        const encodedGameName = encodeURIComponent(gameName);
        const encodedTagLine = encodeURIComponent(tagLine);

        const apiKey = import.meta.env.VITE_RIOT_API_KEY; 

        const accountUrl = `${ACCOUNT_V1_URL}${encodedGameName}/${encodedTagLine}?api_key=${apiKey}`;

        const accountResponse = await fetch(accountUrl);

        // MANEJO DE ERRORES HTTP (Ej: Invocador no existe)
        if (!accountResponse.ok) {
          const errorMsg = accountResponse.status === 404 
            ? `Invocador "${gameName}" no encontrado.`
            : `Error de la API: ${accountResponse.status} (${accountResponse.statusText})`;
          throw new Error(errorMsg);
        }

        const accountData: { puuid: string } = await accountResponse.json();
        const puuid = accountData.puuid;

        const summonerUrl = `${SUMMONER_V4_URL}${puuid}?api_key=${apiKey}`;

        const summonerResponse = await fetch(summonerUrl);
            if (!summonerResponse.ok) {
                throw new Error(`Error en Summoner API: ${summonerResponse.status}`);
            }
        
        const rawData = await summonerResponse.json();
        
        // TRADUCCIÓN: Usamos la función de mapeo (el 'dataMapper') para limpiar los datos
        const transformedData = mapRiotToSummonerData(rawData); 

        // ÉXITO: Guardamos los datos limpios y finalizamos la carga.
        setFetchState({ data: transformedData, loading: false, error: null });

      } catch (e) {
        // ERROR: Gestión de errores tipada
        const errorMessage = e instanceof Error ? e.message : 'Error desconocido.';
        setFetchState({ data: null, loading: false, error: errorMessage });
      }
    };

    fetchSummoner(); 
  // ARRAY DE DEPENDENCIA: Solo se ejecuta si 'summonerName' cambia
  }, [gameName, tagLine]); 
  
  // ----------------------------------------------------------------------
  
  // 4. RENDERIZADO (Contratos de Flujo)

  return (
    <div className="p-8 max-w-lg mx-auto">
      {/* 🔴 CONTRATO ARRIBA: Pasa la función de control al hijo (SearchForm) */}
      <SearchForm onSearch={handleSearch} />

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