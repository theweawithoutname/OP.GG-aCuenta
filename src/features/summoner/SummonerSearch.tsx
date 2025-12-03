import React from 'react';
import { useFetchSummoner } from '../../api/hooks/useFetchSummoner';
import SummonerProfile from './SummonerProfile';
import KataLoading from '../../assets/KataLoading.gif';
import TopLoader from '../search/TopLoader'; 

export interface SummonerSearchProps {
  initialGameName: string;
  initialTagLine: string;
  initialRegionPlatform: string;
  loaderVariant?: 'gif' | 'bar'; 
}

const SummonerSearch: React.FC<SummonerSearchProps> = ({
  initialGameName, 
  initialTagLine, 
  initialRegionPlatform,
  loaderVariant = 'gif'
}) => {

  const { loadMoreMatches, isLoadingMore, ...fetchState } = useFetchSummoner(
    initialGameName, 
    initialTagLine, 
    initialRegionPlatform
  );

  return (
    <div className="p-8">

      {/* 🟡 1. BARRA SUPERIOR (SIEMPRE VISIBLE AL CARGAR) */}
      {fetchState.loading && <TopLoader />}


      {/* 🟡 2. GIF DE KATARINA (SOLO SI ES VARIANT 'GIF') */}
      {fetchState.loading && loaderVariant === 'gif' && (
        <div className='flex justify-center mt-10'>
           <img 
             src={KataLoading} 
             alt="Cargando perfil..." 
             className="w-16 opacity-80"
           />
        </div>
      )}

      {/* 🟢 CONTRATO: Datos cargados */}
      {fetchState.data && (
        <div className="mt-6 rounded-lg">
          {/* 👇 Pasamos loadMoreMatches al perfil */}
          <SummonerProfile 
            data={fetchState.data} 
            onLoadMore={loadMoreMatches}
            isLoadingMore={isLoadingMore}
          /> 
        </div>
      )}

      {/* 🔴 Error */}
      {fetchState.error && (
        <p className="mt-6 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          {fetchState.error}
        </p>
      )}
    </div>
  );
};

export default SummonerSearch;