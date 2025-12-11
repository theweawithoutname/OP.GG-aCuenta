import React from 'react';

interface ItemIconProps {
  iconUrl: string; // La URL completa de la imagen del ítem
  altText: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({ iconUrl, altText }) => {
  // Si la URL está vacía (para ítems no comprados), renderiza un slot vacío
  if (!iconUrl) {
    return (
      <div className="w-6 h-6 bg-bg-default rounded" aria-label="Slot de ítem vacío" />
    );
  }

  return (
    <img 
      src={iconUrl} 
      alt={altText}
      className="w-6 h-6 rounded" // El estilo que tenías de placeholder
    />
  );
};

export default ItemIcon;