// src/components/SearchForm.tsx
import React, { useState } from 'react';
import { PLATFORM_REGIONS_LIST, DISPLAY_REGIONS } from '../../api/utils/constants';

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
      <div className='min-w-[250px] my-3 mx-[5px] bg-[#252525] rounded-lg'>
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full p-3 border-none bg-bg-surface text-text-base text-sm font-medium"
      >
          {PLATFORM_REGIONS_LIST.map(platCode => (
            <option className = "" key={platCode} value={platCode}>
              {DISPLAY_REGIONS[platCode]}
            </option>
        ))}
      </select>
      </div>
      <div className=" min-w-[300px] my-3 mx-[5px]
    
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0
            before:border-b before:border-white/
            after:content-[''] after:absolute after:inset-x-0 after:bottom-0
            after:border-b-2 after:border-lime-400
            after:scale-x-0 after:transition-transform after:duration-2
            focus-within:after:scale-x-100">
      <input
        type="text"
        placeholder="Nombre de invocador... (Ej: Faker)"
        value={gName}
        // Usamos React.ChangeEvent<HTMLInputElement> para tipar el evento
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGName(e.target.value)}
        className="
                  
            w-full p-3 
            bg-bg-surface text-[#e8e8e8] text-sm font-medium
            rounded-t-[5px]
            shadow-[0px_2px_5px_rgba(35,35,35,0.3)]
            transition-colors duration-200
            outline-none
            
            placeholder-white/60 placeholder:transition-opacity placeholder:duration-250 placeholder:select-none
            
            focus:bg-[#353535]
            focus:placeholder:opacity-0
            "
        aria-label="Introduce el nombre de invocador"
      />
      </div>
      <div className="  my-3 mx-[5px]
    
            before:content-[''] before:absolute before:inset-x-0 before:bottom-0
            before:border-b before:border-white/
            after:content-[''] after:absolute after:inset-x-0 after:bottom-0
            after:border-b-2 after:border-lime-400
            
            after:scale-x-0 after:transition-transform after:duration-2


            focus-within:after:scale-x-100">
      <input
  type="text"
  placeholder="Tag Line (Ej: LAS)"
        value={tLine}
        // Usamos React.ChangeEvent<HTMLInputElement> para tipar el evento
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTLine(e.target.value)}
        className="
                  
            w-full p-3 
            bg-bg-surface text-[#e8e8e8] text-sm font-medium
            rounded-t-[5px]
            shadow-[0px_2px_5px_rgba(35,35,35,0.3)]
            transition-colors duration-200
            outline-none
            
            placeholder-white/60 placeholder:transition-opacity placeholder:duration-250 placeholder:select-none
            
            focus:bg-[#353535]
            focus:placeholder:opacity-0
            "
        aria-label="Introduce tu #Tag"
      />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Buscar
      </button>
    </form>
    
  );
};

export default SearchForm;
