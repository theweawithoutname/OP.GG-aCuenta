// src/components/SearchForm.tsx
import React, { useState } from 'react';
import { PLATFORM_REGIONS_LIST, DISPLAY_REGIONS } from '../utils/constants';
// 1. Definimos el Contrato: onSearch debe ser una función.
interface SearchFormProps {
  onSearch: (gameName: string, tagLine: string, regionPlat: string) => void; 
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  // Estado local: Solo para controlar el input y lo que escribe el usuario
    const [gName, setGName] = useState('');
    const [tLine, setTLine] = useState('');
    const [region, setRegion] = useState('LA2');

  // Lógica que se ejecuta al presionar "Buscar"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = gName.trim();
    const trimmedTag = tLine.trim();
    
    if (trimmedName && trimmedTag && region) {
      // 🚀 FLUIDEZ DE ACCIÓN: Ejecuta el callback del padre (handleSearch)
      // Esto le dice al padre: "Aquí tienes el nombre, haz lo que tengas que hacer con él."
      onSearch(trimmedName, trimmedTag, region); 
      
      // Opcional: Limpiar el input después de la búsqueda
      // setSummonerName(''); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg"
      >
          {PLATFORM_REGIONS_LIST.map(platCode => (
            <option key={platCode} value={platCode}>
              {DISPLAY_REGIONS[platCode]}
            </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Nombre de invocador... (Ej: Faker)"
        value={gName}
        // Usamos React.ChangeEvent<HTMLInputElement> para tipar el evento
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGName(e.target.value)}
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Introduce el nombre de invocador"
      />
    <input
        type="text"
        placeholder="Tag Line (Ej: LAS)"
        value={tLine}
        // Usamos React.ChangeEvent<HTMLInputElement> para tipar el evento
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTLine(e.target.value)}
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Introduce el nombre de invocador"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;