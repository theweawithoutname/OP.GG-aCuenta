// src/components/SummonerSearch.tsx
import { mapRiotToSummonerData } from '../utils/dataMappers';
import type { RiotSummonerResponse } from '../types/api';
import React, { useState, useEffect } from 'react';
// Importamos los tipos de forma estricta (type-only)
import type { SummonerData, FetchState } from '../types/api'; 
// Asumimos que SummonerProfile ya está creado
import SummonerProfile from '../SummonerProfile'; 

// [CONFIGURACIÓN] ¡IMPORTANTE! Reemplaza con tus datos.
const REGION = 'la2'; // Ejemplo: Latinoamérica Sur
const BASE_URL = `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/`;
const API_KEY = 'TU_CLAVE_API_AQUI'; 

// Define el estado inicial con el tipo correcto
const initialFetchState: FetchState<SummonerData> = {
  data: null,
  loading: false,
  error: null,
};

const SummonerSearch: React.FC = () => {
  // Estado que guarda el nombre introducido por el usuario (el "input" de la lógica)
  const [inputName, setInputName] = useState<string>('doblelift'); // Valor inicial de ejemplo

  // Estado que guarda el resultado de la API (el "output" de la lógica)
  const [fetchState, setFetchState] = useState<FetchState<SummonerData>>(initialFetchState);

  // useEffect: Se ejecuta cuando la dependencia [inputName] cambia.
  useEffect(() => {
    // 1. Condición de Salida: Si no hay nombre, no hacemos la llamada.
    if (!inputName) return; 

    const fetchSummoner = async () => {
      // 2. Estado de Carga: Activamos 'loading' y limpiamos errores.
      setFetchState({ data: null, loading: true, error: null }); 

      try {
        const url = `${BASE_URL}${encodeURIComponent(inputName)}?api_key=${API_KEY}`;
        const response = await fetch(url);
        
        // 3. Manejo de Errores HTTP
        if (!response.ok) {
          // Por ejemplo, 404 Not Found o 403 Forbidden (API Key inválida)
          const message = `Error ${response.status}: Invocador no encontrado o problema con la API.`;
          throw new Error(message);
        }
        
        const rawData: RiotSummonerResponse = await response.json();

        const transformedData: SummonerData = mapRiotToSummonerData(rawData);
        
        // 5. Éxito: Guardamos los datos.
        setFetchState({ data: transformedData, loading: false, error: null }); 
        
      } catch (e) {
        let errorMessage: string;
        if(e instanceof Error) {
            errorMessage = e.message;
        } else {
            errorMessage = 'Ocurrio un error desconocido durante la conexion.';
        }
        setFetchState({ data: null, loading: false, error: errorMessage});
          }
    };

    fetchSummoner();
    // La función se vuelve a ejecutar cuando inputName cambie
  }, [inputName]); 

  // La función de búsqueda (se pasaría al componente SearchForm como 'callback')
  const handleSearch = (name: string) => {
      setInputName(name); // Esto dispara el useEffect
  };
  
  // --- Renderizado (Pasa los datos del fetch al componente de Presentación) ---
  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* 🛑 Aquí se colocaría el componente SearchForm, pasándole handleSearch como prop onSearch */}
      {/* <SearchForm onSearch={handleSearch} /> */}
      
      {/* 🔴 Muestra el estado de Carga */}
      {fetchState.loading && (
        <div className="mt-6">
            {/* Aquí iría tu componente LoadingSkeleton */}
            <p className="text-blue-500">Cargando perfil...</p> 
        </div>
      )}

      {/* 🟢 Muestra los Datos */}
      {fetchState.data && (
        <div className="mt-6">
          {/* El componente de LÓGICA pasa el dato al componente de PRESENTACIÓN */}
          <SummonerProfile data={fetchState.data} /> 
        </div>
      )}

      {/* 🟡 Muestra el Error */}
      {fetchState.error && (
        <p className="mt-6 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          {fetchState.error}
        </p>
      )}
    </div>
  );
};

export default SummonerSearch;