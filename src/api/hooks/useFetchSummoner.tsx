import { useState, useEffect} from 'react';
import type { FetchState, RankData, SummonerData, MatchData, RiotSummonerResponse } from '../types/api';
import { mapRiotToSummonerData, mapToMatchData } from '../utils/dataMappers';
import { PLATFORM_REGIONS } from '../utils/constants';



//obtener el puuid
const fetchPuuid = async (gameName: string, tagLine: string, apiKey: string, accountUrlBase: string) => {
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);

    const accountUrl = `${accountUrlBase}${encodedGameName}/${encodedTagLine}?api_key=${apiKey}`;
    const accountResponse = await fetch(accountUrl);

    if (!accountResponse.ok) {
        const errorMsg = accountResponse.status === 404 
            ? `Riot ID "${gameName}#${tagLine}" no encontrado.`
            : `Error en la API de Cuenta: ${accountResponse.status} (${accountResponse.statusText})`;
        throw new Error(errorMsg);
    }
    const accountData: { puuid: string } = await accountResponse.json();
    return accountData.puuid;
};

// obtiene el perfil
const fetchProfile = async (puuid: string, apiKey: string, summonerUrlBase: string): Promise<RiotSummonerResponse> => {
    const summonerUrl = `${summonerUrlBase}${puuid}?api_key=${apiKey}`;
    const summonerResponse = await fetch(summonerUrl);
    
    if (!summonerResponse.ok) {
        throw new Error(`Error en la API de Perfil: ${summonerResponse.status}`);
    }
    return summonerResponse.json();
};

// obtiene el rango
const fetchRank = async (puuid: string, apiKey: string, leagueUrlBase: string): Promise<RankData[]> => {
    const leagueUrl = `${leagueUrlBase}${puuid}?api_key=${apiKey}`;
    const leagueResponse = await fetch(leagueUrl);
    
    if (!leagueResponse.ok) {
        if (leagueResponse.status === 404) {
            return []; 
        }
        throw new Error(`Error en la API de Liga: ${leagueResponse.status}`);
    }
    return leagueResponse.json();
};
// ------------------------------------------------------------------


const fetchMatchHistory = async (puuid: string, apiKey: string, regionGlobal: string, start: number = 0, count: number = 5): Promise<MatchData[]> => {

    // Se usan las URLs regionales (americas, europe, etc.) para Match-V5
    const MATCH_IDS_URL = `https://${regionGlobal}.api.riotgames.com/lol/match/v5/matches/by-puuid/`;
    const MATCH_DETAIL_URL = `https://${regionGlobal}.api.riotgames.com/lol/match/v5/matches/`;

    // -----------------------------------------------------
    // PASO A: Obtener la lista de IDs de partidas (esto no cambia)
    // -----------------------------------------------------

    const matchIdsFetchUrl = `${MATCH_IDS_URL}${puuid}/ids?start=${start}&count=${count}&api_key=${apiKey}`;
    
    const idResponse = await fetch(matchIdsFetchUrl);
    if (!idResponse.ok) {
        if (idResponse.status === 404) return []; 
        throw new Error(`Error al obtener lista de IDs de partidas: ${idResponse.status}`);
    }
    const matchIds: string[] = await idResponse.json();
    console.log({puuid});
    if (matchIds.length === 0) return []; 

    
    const matchDetails = [];
    for (const matchId of matchIds) {
        const detailResponse = await fetch(`${MATCH_DETAIL_URL}${matchId}?api_key=${apiKey}`);
        
        if (detailResponse.ok) {
            const detailJson = await detailResponse.json();
            matchDetails.push(detailJson);
        } else {
            console.warn(`No se pudo cargar el detalle de la partida ${matchId}: ${detailResponse.status}`);
        }
    }

    const mappedMatches = matchDetails.map(detail => mapToMatchData(detail, puuid));

    // Finalmente, se mapean los detalles obtenidos
    return mappedMatches.filter(match => match !== null) as MatchData[];
};



export const useFetchSummoner = (gameName: string, tagLine: string, regionPlatform: string) => {

    const regionGlobal = PLATFORM_REGIONS[regionPlatform] || 'americas';
    const ACCOUNT_V1_URL = `https://${regionGlobal}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`;
    const SUMMONER_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;
    const LEAGUE_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/league/v4/entries/by-puuid/`;

    // 1. ESTADO PRINCIPAL
    const [fetchState, setFetchState] = useState<FetchState<SummonerData>>({
        data: null,
        loading: false,
        error: null,
    });

    // 2. NUEVOS ESTADOS PARA PAGINACIÓN
    // Guardamos el PUUID y la Región para no tener que volver a pedirlos al cargar más
    const [accountInfo, setAccountInfo] = useState<{puuid: string, regionGlobal: string} | null>(null);
    // Controlamos cuántas partidas llevamos cargadas (Empezamos con 0)
    const [matchStartIndex, setMatchStartIndex] = useState(0); 

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // 3. EFECTO DE CARGA INICIAL
    useEffect(() => {
        if (!gameName || !tagLine) return; 

        const fetchSummoner = async () => {
            setFetchState({ data: null, loading: true, error: null });
            const apiKey = import.meta.env.VITE_RIOT_API_KEY; 
            const INITIAL_COUNT = 5; // Cuantas partidas cargamos al principio

            try {
                // A. Obtener PUUID
                const puuid = await fetchPuuid(gameName, tagLine, apiKey, ACCOUNT_V1_URL);
                
                // --- GUARDAMOS INFO PARA EL BOTÓN "CARGAR MÁS" ---
                setAccountInfo({ puuid, regionGlobal });
                setMatchStartIndex(INITIAL_COUNT); // La próxima vez empezaremos desde la 5
                // --------------------------------------------------

                // B. Obtener Perfil y Rango en paralelo
                const [rawProfileData, rawRankData] = await Promise.all([
                    fetchProfile(puuid, apiKey, SUMMONER_V4_URL),
                    fetchRank(puuid, apiKey, LEAGUE_V4_URL)
                ]);

                // C. Obtener Historial Inicial (0 a 5)
                // Nota: Asegúrate de actualizar fetchMatchHistory para recibir (start, count)
                const matchHistoryData = await fetchMatchHistory(puuid, apiKey, regionGlobal, 0, INITIAL_COUNT);
                
                // D. Mapear Datos
                const transformedData = mapRiotToSummonerData(
                    rawProfileData, 
                    rawRankData, 
                    matchHistoryData, 
                    gameName, 
                    tagLine
                ); 

                // (Ya no necesitamos el parche .name = gameName porque lo pasamos arriba)

                setFetchState({ data: transformedData, loading: false, error: null });

            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Error de red desconocido.';
                setFetchState({ data: null, loading: false, error: errorMessage });
            }
        };

        fetchSummoner(); 
    }, [gameName, tagLine, regionPlatform, ACCOUNT_V1_URL, SUMMONER_V4_URL, LEAGUE_V4_URL, regionGlobal]); 


    // 4. NUEVA FUNCIÓN: CARGAR MÁS PARTIDAS
    const loadMoreMatches = async () => {
        // Si no tenemos datos base, no hacemos nada
        if (!accountInfo || !fetchState.data) return;

        setIsLoadingMore(true);

        const apiKey = import.meta.env.VITE_RIOT_API_KEY; 
        const COUNT_TO_LOAD = 5; // Cuantas cargar por click

        try {
            // A. Pedimos las siguientes partidas usando el índice guardado
            const newMatches = await fetchMatchHistory(
                accountInfo.puuid, 
                apiKey, 
                accountInfo.regionGlobal, 
                matchStartIndex, // start
                COUNT_TO_LOAD    // count
            );

            // B. Actualizamos el índice para el siguiente click
            setMatchStartIndex(prev => prev + COUNT_TO_LOAD);

            // C. Actualizamos el estado "pegando" las nuevas partidas al final
            setFetchState(prevState => {
                if (!prevState.data) return prevState; 

                return {
                    ...prevState,
                    data: {
                        ...prevState.data,
                        matchHistory: [...prevState.data.matchHistory, ...newMatches]
                    }
                };
            });

        } catch (e) {
            console.error("Error al cargar más partidas:", e);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return { ...fetchState, loadMoreMatches, isLoadingMore };
};