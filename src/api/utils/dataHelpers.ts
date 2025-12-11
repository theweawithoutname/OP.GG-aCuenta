// src/utils/dateHelpers.ts

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  // La API de Riot a veces devuelve segundos y a veces milisegundos.
  // Si la fecha es muy pequeña (año 1970), multiplicamos por 1000.
  const time = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  
  const diff = now - time;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Recién';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days === 1) return 'Hace 1 día';
  return `Hace ${days} días`;
};

export const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return `${minutes}m ${remSeconds}s`;
};