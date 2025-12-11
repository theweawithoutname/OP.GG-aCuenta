/* 
  * DEFINICION DE DATOS PARA SUMMONERICON
  ? definimos lo datos relacionados al summonerIcon
  ? definimos los datos relacionados al summonerProfile (basicamente los datos transformados con el dataMappers)
  * props ------> SummonerIcon



*/

import type { SummonerData } from "./api";

export interface SummonerIconProps {
  iconUrl: string; // La URL de la imagen (debe ser un string)
  altText: string; // El texto alternativo para accesibilidad (debe ser un string)
}

export interface SummonerProfileProps {
  data: SummonerData;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onUpdate: () => void;
  isUpdating: boolean;
}