// src/components/SearchForm.tsx
import React, { useState } from 'react';
import { PLATFORM_REGIONS_LIST, DISPLAY_REGIONS } from '../../api/utils/constants';
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface SearchFormProps {
  onSearch: (gameName: string, tagLine: string, regionPlat: string) => void; 
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [gName, setGName] = useState('');
  const [tLine, setTLine] = useState('');
  const [region, setRegion] = useState('LA2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = gName.trim();
    const trimmedTag = tLine.trim();
    
    if (trimmedName && trimmedTag && region) {
      onSearch(trimmedName, trimmedTag, region); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end space-x-2">

      {/* --- SELECT HEADLESS UI (DISEÑO UNIFICADO) --- */}
      {/* Aplicamos al contenedor del Listbox las MISMAS clases de wrapper 
          que tienen tus inputs (relative, bordes animados before/after).
      */}
      <div className="relative min-w-[250px] my-3 mx-[5px]">
        <Listbox value={region} onChange={setRegion}>
          {/* 1. Desestructuramos el estado 'open' */}
          {({ open }) => (
            <div className={`
              /* Wrapper relativo necesario para posicionar elementos */
              relative w-full

              /* --- LÍNEA BASE (Gris) --- */
              before:content-[''] before:absolute before:inset-x-0 before:bottom-0
              before:border-b before:border-border-color

              /* --- LÍNEA ACTIVA (Animada) --- */
              after:content-[''] after:absolute after:inset-x-0 after:bottom-0
              after:border-b-2 after:border-primary
              after:transition-transform after:duration-200
              
              /* 2. AQUÍ ESTÁ EL ARREGLO:
                Usamos la variable 'open'. Si está abierto, escala a 100. Si no, a 0.
                Ya no dependemos de si tiene foco o no. 
              */
              ${open ? 'after:scale-x-100' : 'after:scale-x-0'}
            `}>
              <Listbox.Button className={`
                relative w-full p-3 
                text-left 
                text-text-base text-sm font-medium
                rounded-t-[5px]
                shadow-[0px_2px_5px_rgba(35,35,35,0.3)]
                transition-colors duration-200
                outline-none
                cursor-pointer
                
                /* 3. ARREGLO DEL FONDO:
                  Si está abierto, usa el fondo oscuro (bg-default).
                  Si está cerrado, usa el fondo claro (bg-surface).
                */
                ${open ? 'bg-bg-default' : 'bg-bg-surface'}
              `}>
                <span className="block truncate">{DISPLAY_REGIONS[region]}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    /* Usamos 'open' también para rotar el icono */
                    className={`h-5 w-5 text-text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Listbox.Options className="
                absolute mt-1 max-h-60 w-full overflow-auto 
                rounded-lg bg-bg-surface text-base shadow-lg 
                ring-1 ring-black ring-opacity-5 
                focus:outline-none 
                z-10
                scrollbar-thin scrollbar-thumb-primary scrollbar-track-bg-surface
              ">
                {PLATFORM_REGIONS_LIST.map(platCode => (
                  <Listbox.Option
                    key={platCode}
                    value={platCode}
                    className="
                      relative cursor-default select-none p-3
                      text-text-base
                      data-[active]:bg-primary data-[active]:text-primary-text
                    "
                  >
                    <span className="block truncate data-[selected]:font-medium">
                      {DISPLAY_REGIONS[platCode]}
                    </span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>
      </div>

      {/* --- INPUT 1 (Game Name) --- */}
      <div className="
        relative min-w-[300px] my-3 mx-[5px]
        before:content-[''] before:absolute before:inset-x-0 before:bottom-0
        before:border-b before:border-border-color
        after:content-[''] after:absolute after:inset-x-0 after:bottom-0
        after:border-b-2 after:border-primary
        after:scale-x-0 after:transition-transform after:duration-200
        focus-within:after:scale-x-100
      ">
        <input
          type="text"
          placeholder="Nombre de invocador... (Ej: Faker)"
          value={gName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGName(e.target.value)}
          className="
            w-full p-3 
            bg-bg-surface text-text-base text-sm font-medium
            rounded-t-[5px]
            shadow-[0px_2px_5px_rgba(35,35,35,0.3)]
            transition-colors duration-200
            outline-none
            placeholder:text-text-muted placeholder:transition-opacity placeholder:duration-250 placeholder:select-none
            focus:bg-bg-default
            focus:placeholder:opacity-0
          "
          aria-label="Introduce el nombre de invocador"
        />
      </div>

      {/* --- INPUT 2 (Tag Line) --- */}
      <div className="
        relative my-3 mx-[5px]
        before:content-[''] before:absolute before:inset-x-0 before:bottom-0
        before:border-b before:border-border-color
        after:content-[''] after:absolute after:inset-x-0 after:bottom-0
        after:border-b-2 after:border-primary
        after:scale-x-0 after:transition-transform after:duration-200
        focus-within:after:scale-x-100
      ">
        <input
          type="text"
          placeholder="Tag Line (Ej: LAS)"
          value={tLine}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTLine(e.target.value)}
          className="
            w-full p-3 
            bg-bg-surface text-text-base text-sm font-medium
            rounded-t-[5px]
            shadow-[0px_2px_5px_rgba(35,35,35,0.3)]
            transition-colors duration-200
            outline-none
            placeholder:text-text-muted placeholder:transition-opacity placeholder:duration-250 placeholder:select-none
            focus:bg-bg-default
            focus:placeholder:opacity-0
          "
          aria-label="Introduce tu #Tag"
        />
      </div>

      {/* --- BOTÓN DE BÚSQUEDA --- */}
      <button
        type="submit"
        className="
          px-6 py-3 my-3 mx-[5px]
          bg-primary text-primary-text 
          font-semibold rounded-lg shadow-md 
          hover:bg-primary-hover 
          transition-colors duration-200
        "
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;
