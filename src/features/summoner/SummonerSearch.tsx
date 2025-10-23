// src/components/SummonerSearch.tsx

/* 
  *FUNCIONA COMO INTERMEDIARIO ENTRE LA CAPA VISUAL Y LA API, gestionando errores, cargas y la llamada a la API

  * SummonerSearch -----> types/props 



*/
import React from 'react';
import { useFetchSummoner } from '../../api/hooks/useFetchSummoner';

// Importaciones de Contratos (Componentes de Presentación que usaremos después)
import SummonerProfile from './SummonerProfile';
import KataLoading from '../assets/KataLoading.gif'

export interface SummonerSearchProps {
  initialGameName: string;
  initialTagLine: string;
  initialRegionPlatform: string;
}

const SummonerSearch: React.FC<SummonerSearchProps> = ({initialGameName, initialTagLine, initialRegionPlatform}) => {

  const fetchState = useFetchSummoner(initialGameName, initialTagLine, initialRegionPlatform);

  return (
    <div className="p-8 max-w-lg mx-auto">

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