export const PLATFORM_REGIONS: Record<string, string> = {
    // AMERICAS
    NA1: 'americas',  // Norteamérica
    BR1: 'americas',  // Brasil
    LA1: 'americas',  // Latinoamérica Norte
    LA2: 'americas',  // Latinoamérica Sur (Tu region actual)
    OC1: 'americas',  // Oceanía

    // EUROPE
    EUW1: 'europe',   // Europa Oeste
    EUN1: 'europe',   // Europa Nórdica y Este
    TR1: 'europe',    // Turquía
    RU: 'europe',     // Rusia

    // ASIA (Usado principalmente para Riot ID global, pero menos común para Plataforma)
    KR: 'asia',       // Corea
    JP1: 'asia',      // Japón
};

export const DISPLAY_REGIONS: Record<string, string> = {
    // AMERICAS
    'NA1': 'Norteamérica',
    'BR1': 'Brasil',
    'LA1': 'Latinoamérica Norte (LAN)',
    'LA2': 'Latinoamérica Sur (LAS)',
    'OC1': 'Oceanía',

    // EUROPE
    'EUW1': 'Europa Oeste',
    'EUN1': 'Europa Nórdica/Este',
    'TR1': 'Turquía',
    'RU': 'Rusia',
    
    // ASIA
    'KR': 'Corea',
    'JP1': 'Japón',
};

// Lista simple de plataformas disponibles para el menú desplegable
export const PLATFORM_REGIONS_LIST: string[] = Object.keys(DISPLAY_REGIONS);