import React from 'react';

interface ChampionIconProps {
  iconUrl: string; // La URL completa de la imagen del campeón
  altText: string;
  size?: 'small' | 'medium' | 'large';
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ iconUrl, altText, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  // 1. Si la URL está vacía, no renderizamos la imagen, solo un placeholder.
  if (!iconUrl) {
    return (
        <div className={`rounded-full border border-border-color bg-bg-default/50 ${sizeClasses[size]}`} />
    );
  }

  // 2. Si la URL es válida (truthy), renderizamos el componente.
  return (
    <div 
      className={`
        relative
        rounded-full
        overflow-hidden
        border border-border-color
        shrink-0
        ${sizeClasses[size]}
      `}
    >
      <img 
        src={iconUrl} 
        alt={altText}
        className="w-full h-full object-cover transform scale-110"
      />
    </div>
  );
};

export default ChampionIcon;