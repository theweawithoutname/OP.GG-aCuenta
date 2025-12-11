import React from 'react';

const Footer: React.FC = () => {
  // Reemplaza esto con el nombre exacto que pusiste en el formulario de Riot
  const PROJECT_NAME = "MySummonerTracker"; 

  return (
    <footer className="mt-12 py-8 border-t border-border-color bg-bg-surface/50">
      <div className="container mx-auto px-4 text-center">
        
        {/* Enlaces o Créditos Simples (Opcional) */}
        <div className="mb-4 text-sm text-text-base font-semibold">
          Desarrollado con <span className="text-red-500">♥</span> usando React & Riot API
        </div>

        {/* --- REQUIRED LEGAL JIBBER JABBER --- */}
        {/* Este bloque es obligatorio para que aprueben tu APP */}
        <p className="text-xs text-text-muted leading-relaxed max-w-3xl mx-auto">
          {PROJECT_NAME} isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;