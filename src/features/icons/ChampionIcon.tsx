import React from 'react';

interface ChampionIconProps {
  iconUrl: string; 
  altText: string; 
  size?: 'small' | 'medium' | 'large'; 
}

const ChampionIcon: React.FC<ChampionIconProps> = ({ iconUrl, altText, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10', 
    large: 'w-12 h-12',
  };

  return (
    <div 
      className={`
        relative
        rounded-full
        overflow-hidden
        border border-border-color 
        ${sizeClasses[size]}
        shrink-0
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