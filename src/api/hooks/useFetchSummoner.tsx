import { useState, useEffect} from 'react';
import type { FetchState, RankData, SummonerData, RiotSummonerResponse } from '../types/api';
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


export const useFetchSummoner = (gameName: string, tagLine: string, regionPlatform: string): FetchState<SummonerData> => {

    const regionGlobal = PLATFORM_REGIONS[regionPlatform] || 'americas';
    const ACCOUNT_V1_URL = `https://${regionGlobal}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`;
    const SUMMONER_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;
    const LEAGUE_V4_URL = `https://${regionPlatform}.api.riotgames.com/lol/league/v4/entries/by-puuid/`;

    
    
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
                const rawProfileData = await fetchProfile(puuid, apiKey, SUMMONER_V4_URL); 
                const rawRankData = await fetchRank(puuid, apiKey, LEAGUE_V4_URL); 
                
                // traduce los datos y los muestra
                const transformedData = mapRiotToSummonerData(rawProfileData, rawRankData); 

                setFetchState({ data: transformedData, loading: false, error: null });

            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Error de red desconocido.';
                setFetchState({ data: null, loading: false, error: errorMessage });
            }
        };

        fetchSummoner(); 
    }, [gameName, tagLine, regionPlatform, ACCOUNT_V1_URL, SUMMONER_V4_URL, LEAGUE_V4_URL]); 

    return fetchState;
};