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

export const QUEUE_ID_TO_NAME: Record<number, string> = {
  420: 'Ranked Solo/Duo',
  440: 'Ranked Flex',
  400: 'Normal Draft',
  430: 'Normal Blind',
  450: 'ARAM',
  490: 'Quickplay',
  700: 'Clash',
  1700: 'Arena',
  1900: 'URF',
};

export const SPELL_ID_MAP: Record<number, string> = {
  1:  "SummonerBoost",
  3:  "SummonerExhaust",
  4:  "SummonerFlash",
  6:  "SummonerHaste",     // Ghost
  7:  "SummonerHeal",
  11: "SummonerSmite",
  12: "SummonerTeleport",
  13: "SummonerMana",      // Clarity
  14: "SummonerDot",       // Ignite
  21: "SummonerBarrier",
  30: "SummonerPoroRecall",
  31: "SummonerPoroThrow",
  32: "SummonerSnowball",  // Mark (ARAM)
  39: "SummonerSnowURFSnowball_Mark",
};

export const RUNE_STYLE_MAP: Record<number, string> = {
  8000: "7201_precision",
  8100: "7200_domination",
  8200: "7202_sorcery",
  8300: "7203_whimsy",     // Inspiration
  8400: "7204_resolve"
};

// Lista simple de plataformas disponibles para el menú desplegable
export const PLATFORM_REGIONS_LIST: string[] = Object.keys(DISPLAY_REGIONS);