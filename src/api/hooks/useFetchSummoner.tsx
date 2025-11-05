import { useState, useEffect} from 'react';
import type { FetchState, RankData, SummonerData, MatchData, RiotSummonerResponse, RiotMatchDetailResponse } from '../types/api';
import { mapRiotToSummonerData } from '../utils/dataMappers';
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

const mapToMatchData = (matchDetail: RiotMatchDetailResponse, puuid: string): MatchData | null => {
    const participant = matchDetail.info.participants.find((p: RiotMatchDetailResponse['info']['participants'][0]) => p.puuid.toLowerCase() === puuid.toLowerCase());

    if (!participant) {
        console.warn(`PUUID no encontrado en la partida ${matchDetail.metadata.matchId}.`);
        return null;
    }

    const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`;

    const items = [
        participant.item0, participant.item1, participant.item2,
        participant.item3, participant.item4, participant.item5, participant.item6
    ];

    const validItems = items.filter((id: number) => id !== 0);

    return {
        matchId: matchDetail.metadata.matchId,
        gameDuration: matchDetail.info.gameDuration,
        queueId: matchDetail.info.queueId,
        championName: participant.championName,
        win: participant.win,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        kda: kda,
        items: validItems,
    }

}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchMatchHistory = async (puuid: string, apiKey: string,): Promise<MatchData[]> => {

    // Se usan las URLs regionales (americas, europe, etc.) para Match-V5
    const MATCH_IDS_URL = `/api/riot/lol/match/v5/matches/by-puuid/`;
    const MATCH_DETAIL_URL = `/api/riot/lol/match/v5/matches/`;

    // -----------------------------------------------------
    // PASO A: Obtener la lista de IDs de partidas (esto no cambia)
    // -----------------------------------------------------
    const cacheBust = `&_t=${new Date().getTime()}`;
    const matchIdsFetchUrl = `${MATCH_IDS_URL}${puuid}/ids?api_key=${apiKey}${cacheBust}`;
    
    const idResponse = await fetch(matchIdsFetchUrl, {cache: 'no-store'});
    if (!idResponse.ok) {
        if (idResponse.status === 404) return []; 
        throw new Error(`Error al obtener lista de IDs de partidas: ${idResponse.status}`);
    }
    const matchIds: string[] = await idResponse.json();
    console.log({puuid});
    if (matchIds.length === 0) return []; 

    
    const matchDetails = []; // Array para guardar los resultados

    // Se usa 'for...of' para que 'await' funcione dentro del bucle
    for (const matchId of matchIds) {
        const detailResponse = await fetch(`${MATCH_DETAIL_URL}${matchId}?api_key=${apiKey}`);
        
        if (detailResponse.ok) {
            const detailJson = await detailResponse.json();
            matchDetails.push(detailJson);
        } else {
            // Si una partida falla (ej. 429), la saltamos y continuamos
            console.warn(`No se pudo cargar el detalle de la partida ${matchId}: ${detailResponse.status}`);
        }

        // ⏳ PAUSA OBLIGATORIA: Esperamos 100ms antes de la siguiente solicitud
        // Esto evita superar el límite de 20 solicitudes/segundo
        await delay(100); 
    }

    const mappedMatches = matchDetails.map(detail => mapToMatchData(detail, puuid));

    // Finalmente, se mapean los detalles obtenidos
    return mappedMatches.filter(match => match !== null) as MatchData[];
};



export const useFetchSummoner = (gameName: string, tagLine: string, regionPlatform: string): FetchState<SummonerData> => {

    const regionGlobal = PLATFORM_REGIONS[regionPlatform] || 'americas';
    // 🛑 CAMBIO CLAVE: Las URLs ahora son relativas y apuntan al proxy
    const ACCOUNT_V1_URL = `/api/riot/riot/account/v1/accounts/by-riot-id/`;

    // 🛑 CAMBIO CLAVE: Usamos la URL base de la plataforma
    // (Ajusta la URL de SUMMONER y LEAGUE si usan diferentes regiones base)
    const SUMMONER_V4_URL = `/api/platform/lol/summoner/v4/summoners/by-puuid/`;
    const LEAGUE_V4_URL = `/api/platform/lol/league/v4/entries/by-puuid/`;

    
    
    const [fetchState, setFetchState] = useState<FetchState<SummonerData>>({
        data: null,
        loading: false,
        error: null,
    });
    
    // 2. EL MOTOR ASÍNCRONO (Tu useEffect completo se mueve aquí)
    useEffect(() => {
        if (!gameName || !tagLine) return; 

        const fetchSummoner = async () => {
            setFetchState({ data: null, loading: true, error: null });
            const apiKey = import.meta.env.VITE_RIOT_API_KEY; 

            try {
                
                //obtener el puuid
                const puuid = await fetchPuuid(gameName, tagLine, apiKey, ACCOUNT_V1_URL);

                //obtener los datos
                    const [rawProfileData, rawRankData] = await Promise.all([
                    fetchProfile(puuid, apiKey, SUMMONER_V4_URL),
                    fetchRank(puuid, apiKey, LEAGUE_V4_URL)
                ]);

                const matchHistoryData = await fetchMatchHistory(puuid, apiKey);
                
                // traduce los datos y los muestra
                const transformedData = mapRiotToSummonerData(rawProfileData, rawRankData, matchHistoryData); 

                setFetchState({ data: transformedData, loading: false, error: null });

            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Error de red desconocido.';
                setFetchState({ data: null, loading: false, error: errorMessage });
            }
        };

        fetchSummoner(); 
    }, [gameName, tagLine, regionPlatform, ACCOUNT_V1_URL, SUMMONER_V4_URL, LEAGUE_V4_URL, regionGlobal]); 

    return fetchState;
};