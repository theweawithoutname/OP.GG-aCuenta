import React from 'react';

const TopLoader: React.FC = () => {
  return (
    // CAMBIO: z-[9999] para asegurar que esté encima del Navbar (que es z-50)
    <div className="fixed top-0 left-0 w-full h-1 bg-bg-surface z-[9999] overflow-hidden">
      
      {/* DEBUG: Si no ves la línea, cambia 'bg-primary' por 'bg-red-500' 
         temporalmente para ver si es un tema de colores.
      */}
      <div className="h-full bg-primary absolute animate-loading-bar shadow-[0_0_10px_var(--color-primary)]"></div>
      
    </div>
  );
};

export default TopLoader;