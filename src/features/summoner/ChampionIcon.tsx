import React from 'react';

interface ChampionIconProps {
  iconUrl: string; // La URL completa de la imagen del campeón
  altText: string; // Nombre del campeón para accesibilidad
  size?: 'small' | 'medium' | 'large'; // Opcional: para diferentes tamaños
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ iconUrl, altText, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10', // Un buen tamaño por defecto para el historial
    large: 'w-12 h-12',
  };

  return (
    <img 
      src={iconUrl} 
      alt={altText}
      className={`rounded-full border border-border-color ${sizeClasses[size]} object-cover`}
    />
  );
};

export default ChampionIcon;