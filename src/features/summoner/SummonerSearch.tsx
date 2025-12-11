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

  // ✅ CORRECCIÓN: Extraemos TODAS las funciones y estados necesarios
  const { 
    loadMoreMatches, 
    updateAllData, 
    isUpdating, 
    isLoadingMore, // ⬅️ ¡Aquí está! No hay que borrarlo
    ...fetchState 
  } = useFetchSummoner(
    initialGameName, 
    initialTagLine, 
    initialRegionPlatform
  );

  return (
    <div className="p-8">

      {/* 1. BARRA SUPERIOR (Carga inicial O Actualización manual) */}
      {(fetchState.loading || isUpdating) && <TopLoader />}


      {/* 2. GIF DE KATARINA (Solo carga inicial y si es variant 'gif') */}
      {fetchState.loading && loaderVariant === 'gif' && (
        <div className='flex justify-center mt-10'>
           <img 
             src={KataLoading} 
             alt="Cargando perfil..." 
             className="w-16 opacity-80"
           />
        </div>
      )}

      {/* 3. PERFIL (Datos cargados) */}
      {fetchState.data && (
        <div className="mt-6 rounded-lg">
          <SummonerProfile 
            data={fetchState.data} 
            
            /* Props para Paginación */
            onLoadMore={loadMoreMatches}
            isLoadingMore={isLoadingMore} // ⬅️ Lo pasamos al perfil
            
            /* Props para Actualizar (Refresh) */
            onUpdate={updateAllData}
            isUpdating={isUpdating}
          /> 
        </div>
      )}

      {/* 4. ERROR */}
      {fetchState.error && (
        <p className="mt-6 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          {fetchState.error}
        </p>
      )}
    </div>
  );
};

export default SummonerSearch;