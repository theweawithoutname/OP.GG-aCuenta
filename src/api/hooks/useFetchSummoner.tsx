import { useState, useEffect, useCallback} from 'react';
import type { FetchState, RankData, SummonerData, MatchData, RiotSummonerResponse, ChampionMastery } from '../types/api';
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


const fetchMatchHistory = async (puuid: string, apiKey: string, regionGlobal: string, start: number = 0, count: number = 10): Promise<MatchData[]> => {

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

const fetchMasteries = async (puuid: string, apiKey: string, platformUrl: string): Promise<ChampionMastery[]> => {
    // Pedimos solo el TOP 5 para no llenar la memoria
    const url = `${platformUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=4&api_key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        // Si falla, retornamos array vacío para no romper la app
        return [];
    }
    return response.json();
};



export const useFetchSummoner = (gameName: string, tagLine: string, regionPlatform: string) => {

    const regionGlobal = PLATFORM_REGIONS[regionPlatform] || 'americas';
    const ACCOUNT_V1_URL = `https://${regionGlobal}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`;
    const SUMMONER_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;
    const LEAGUE_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/league/v4/entries/by-puuid/`;
    const MASTERY_URL = `https://${regionPlatform}.api.riotgames.com`;

    // 1. ESTADOS
    const [fetchState, setFetchState] = useState<FetchState<SummonerData>>({
        data: null,
        loading: false,
        error: null,
    });

    const [accountInfo, setAccountInfo] = useState<{puuid: string, regionGlobal: string} | null>(null);
    const [matchStartIndex, setMatchStartIndex] = useState(0); 
    
    // Estados visuales de carga
    const [isUpdating, setIsUpdating] = useState(false);      // Para el botón de refresh
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Para el botón de "Cargar más"


    // 2. FUNCIÓN DE CARGA PRINCIPAL (Reutilizable)
    const fetchData = useCallback(async (isManualUpdate = false) => {
        // Si es manual, activamos isUpdating. Si es carga inicial, activamos loading general.
        if (isManualUpdate) {
            setIsUpdating(true);
        } else {
            setFetchState(prev => ({ ...prev, loading: true, error: null }));
        }

        const apiKey = import.meta.env.VITE_RIOT_API_KEY; 
        const INITIAL_COUNT = 5;

        try {
            const puuid = await fetchPuuid(gameName, tagLine, apiKey, ACCOUNT_V1_URL);
            
            // Guardamos info y REINICIAMOS el índice de partidas
            setAccountInfo({ puuid, regionGlobal });
            setMatchStartIndex(INITIAL_COUNT); 

            const [rawProfileData, rawRankData, rawMasteryData] = await Promise.all([
                fetchProfile(puuid, apiKey, SUMMONER_V4_URL),
                fetchRank(puuid, apiKey, LEAGUE_V4_URL),
                fetchMasteries(puuid, apiKey, MASTERY_URL)
            ]);

            const matchHistoryData = await fetchMatchHistory(puuid, apiKey, regionGlobal, 0, INITIAL_COUNT);
            
            const transformedData = mapRiotToSummonerData(
                rawProfileData, 
                rawRankData, 
                matchHistoryData, 
                gameName, 
                tagLine,
                
            ); 

            transformedData.masteries = rawMasteryData;

            setFetchState({ data: transformedData, loading: false, error: null });

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Error desconocido.';
            setFetchState(prev => ({ ...prev, error: errorMessage }));
        } finally {
            setFetchState(prev => ({ ...prev, loading: false }));
            setIsUpdating(false);
        }
    }, [gameName, tagLine, ACCOUNT_V1_URL, SUMMONER_V4_URL, LEAGUE_V4_URL, regionGlobal, MASTERY_URL]);


    // 3. EFECTO: Ejecutar al montar o cambiar props
    useEffect(() => {
        if (gameName && tagLine) {
            fetchData(false); // Carga inicial
        }
    }, [fetchData, gameName, tagLine]);


    // 4. FUNCIÓN: CARGAR MÁS PARTIDAS (Paginación)
    const loadMoreMatches = async () => {
        if (!accountInfo || !fetchState.data) return;

        setIsLoadingMore(true);
        const apiKey = import.meta.env.VITE_RIOT_API_KEY; 
        const COUNT_TO_LOAD = 5;

        try {
            const newMatches = await fetchMatchHistory(
                accountInfo.puuid, 
                apiKey, 
                accountInfo.regionGlobal, 
                matchStartIndex, 
                COUNT_TO_LOAD
            );

            setMatchStartIndex(prev => prev + COUNT_TO_LOAD);

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

    // 5. FUNCIÓN: ACTUALIZAR TODO (Refresh)
    const updateAllData = () => {
        fetchData(true); // isManualUpdate = true
    };

    return { ...fetchState, loadMoreMatches, updateAllData, isUpdating, isLoadingMore };
};