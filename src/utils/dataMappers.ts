// src/utils/dataMappers.ts

/** 
 *  * ESTE ARCHIVO TIENE EL FIN DE TRADUCIR LOS DATOS DE LA API
 *  * EL MOTIVO ES QUE SI RIOT CAMBIA ALGO DE LA API, SOLO TENGAMOS QUE MODIFICAR ESTE ARCHIVO Y API.TS
 *  ? 1-importamos las 2 interfaces que definimos en api.ts
 *  ? 2-definimos la version del ddragon (de donde se sacan imagenes, contenido no textual, etc) aunque esto seria mejor dinamicamente
 *  ? 3-creamos la funcion que va a traducir, que recibe los datos de la API, y retorna los datos traducidos
 *  ? 4-definimos una URL a partir de la version del ddragon y la ID del icono con el fin de conseguir la URL del icono que queremos
 *  ? 5-retornamos los datos traducidos, el summonerlevel simplificado y la URL del icono que usaremos mas tarde
 */ 

import type { RiotSummonerResponse, SummonerData } from '../types/api';

// *Nota: Esto debería obtenerse dinámicamente, pero se usa una constante por ahora.
const DDRAGON_VERSION = '14.20.1'; // Asegúrate de actualizar la versión

export function mapRiotToSummonerData(riotData: RiotSummonerResponse): SummonerData {
  
  const profileIconUrl = 
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${riotData.profileIconId}.png`;

  return {
    name: riotData.name,
    level: riotData.summonerLevel, // Mapeo de nombre: summonerLevel -> level
    profileIconUrl: profileIconUrl, // Creación de la URL a partir del ID
  };
}
