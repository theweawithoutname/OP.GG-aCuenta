import React from 'react';
import { type MatchData } from '../../api/types/api'; 
import ItemIcon from '../icons/ItemIcon';
import ChampionIcon from '../icons/ChampionIcon';
import { QUEUE_ID_TO_NAME, SPELL_ID_MAP, RUNE_STYLE_MAP } from '../../api/utils/constants';
import { formatTimeAgo, formatDuration } from '../../api/utils/dataHelpers';

// Definimos la versión aquí o impórtala de tus constantes
const DDRAGON_VERSION = '14.20.1'; 

interface MatchHistoryItemProps {
  match: MatchData;
}

const MatchHistoryItem: React.FC<MatchHistoryItemProps> = ({ match }) => {

  // 1. LÓGICA DE PARTICIPANTES (Separar equipos)
  const teamBlue = match.participants.filter(p => p.teamId === 100);
  const teamRed = match.participants.filter(p => p.teamId === 200);

  // Helper para renderizar cada fila de la lista de jugadores
  const renderParticipantRow = (p: typeof match.participants[0]) => {
    // Detectamos si este participante es el usuario dueño del perfil
    // (Comparamos por nombre de campeón ya que 'match' es la vista desde SU perspectiva)
    const isMe = p.championName === match.championName;

    return (
      <div key={p.puuid} className="flex items-center gap-1.5 w-full overflow-hidden">
        {/* Icono Miniatura (16x16px) */}
        <div className="w-4 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-white/10 bg-black">
          <img 
            src={p.championIconUrl} 
            alt={p.championName} 
            className="w-full h-full object-cover transform scale-110" 
          />
        </div>
        {/* Nombre truncado */}
        <span className={`text-[10px] truncate leading-none ${
            isMe 
            ? 'text-white font-bold' 
            : 'text-text-muted hover:text-text-base'
        }`}>
          {p.gameName}
        </span>
      </div>
    );
  };
  
  // 2. TEMA DE COLORES
  const theme = match.win 
    ? {
        bg: 'bg-blue-500/10',
        border: 'border-l-4 border-blue-500', 
        text: 'text-blue-400',
        kda: 'text-gray-200'
      }
    : {
        bg: 'bg-red-500/10',
        border: 'border-l-4 border-red-500',
        text: 'text-red-400',
        kda: 'text-gray-200'
      };

  const queueName = QUEUE_ID_TO_NAME[match.queueId] || 'Partida';

  // 3. LÓGICA DE HECHIZOS (SPELLS) - DataDragon
  const spell1Name = SPELL_ID_MAP[match.summoner1Id] || 'SummonerFlash'; 
  const spell2Name = SPELL_ID_MAP[match.summoner2Id] || 'SummonerDot';

  const spell1Url = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spell1Name}.png`;
  const spell2Url = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spell2Name}.png`;

  // 4. LÓGICA DE RUNAS (RUNES) - CommunityDragon
  const primaryStyleId = match.perks?.primaryStyle;
  const secondaryStyleId = match.perks?.subStyle;
  const primaryRuneFileName = primaryStyleId ? RUNE_STYLE_MAP[primaryStyleId] : null;
  const secondaryRuneFileName = secondaryStyleId ? RUNE_STYLE_MAP[secondaryStyleId] : null;

  const runePrimaryUrl = primaryRuneFileName 
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${primaryRuneFileName}.png` 
    : '';
    
  const runeSecondaryUrl = secondaryRuneFileName
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${secondaryRuneFileName}.png`
    : '';

  return (
    <div className={`
      relative p-3 rounded-r-lg mb-3 shadow-sm transition-all hover:shadow-md
      /* Estructura Grid corregida:
         Col 2 (Campeón) en 'auto' para reducir espacio.
         Col 4 (Items) en 'auto' para pegarse al KDA.
         Col 5 (Participantes) en '1fr' para llenar el resto. */
      grid grid-cols-[100px_auto_110px_auto_1fr] gap-x-4 items-center
      ${theme.bg} ${theme.border}
    `}>
      
      {/* === COL 1: INFO META === */}
      <div className="flex flex-col justify-center text-xs space-y-1">
        <span className="font-bold text-text-muted uppercase tracking-wide truncate">
            {queueName}
        </span>
        <span className="text-text-muted/60 text-[10px]">
            {formatTimeAgo(match.gameEndTimestamp)}
        </span>
        <div className={`font-extrabold text-sm ${theme.text}`}>
          {match.win ? 'VICTORIA' : 'DERROTA'}
        </div>
        <span className="text-text-base font-mono">
            {formatDuration(match.gameDuration)}
        </span>
      </div>

      {/* === COL 2: EL JUGADOR === */}
      <div className="flex items-center gap-3">
        {/* A. Icono Campeón */}
        <div className="relative">
            <ChampionIcon 
                iconUrl={match.championIconUrl} 
                altText={match.championName} 
                size="large"
            />
            <span className="absolute -bottom-1 -right-1 bg-bg-default text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-border-color text-text-base font-bold">
                {match.champLevel}
            </span>
        </div>

        {/* B. Spells y Runas */}
        <div className="grid grid-cols-2 gap-1 w-8">
            <img 
              src={spell1Url} 
              alt="Spell D" 
              className="w-4 h-4 rounded border border-black/20" 
              onError={(e) => {e.currentTarget.style.opacity = '0.5'}} 
            />
            <img 
              src={spell2Url} 
              alt="Spell F" 
              className="w-4 h-4 rounded border border-black/20" 
              onError={(e) => {e.currentTarget.style.opacity = '0.5'}}
            />
            <div className="w-4 h-4 rounded-full bg-black/50 flex items-center justify-center overflow-hidden border border-black/30">
                 <img 
                    src={runePrimaryUrl || undefined} 
                    alt="P" 
                    className="w-full h-full object-cover transform scale-90"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
            </div>
            <div className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center overflow-hidden border border-black/10">
                 <img 
                    src={runeSecondaryUrl || undefined} 
                    alt="S" 
                    className="w-full h-full object-cover opacity-80 scale-90"
                    onError={(e) => { e.currentTarget.style.display = 'none';}}
                 />
            </div>
        </div>
      </div>

      {/* === COL 3: KDA Stats === */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-base font-bold text-text-base tracking-wide whitespace-nowrap">
            <span>{match.kills}</span>
            <span className="text-text-muted mx-1">/</span>
            <span className="text-accent-loss">{match.deaths}</span>
            <span className="text-text-muted mx-1">/</span>
            <span>{match.assists}</span>
        </div>
        <div className="text-xs text-text-muted mt-0.5">
            <span className="font-bold text-text-base">
                {match.deaths === 0 ? "Perfect" : ((match.kills + match.assists) / match.deaths).toFixed(2)}:1
            </span> KDA
        </div>
      </div>

      {/* === COL 4: ÍTEMS === */}
      <div className="flex items-center">
         <div className="grid grid-cols-4 gap-1">
            {match.items.map((itemUrl, index) => (
                <div key={index} className="w-7 h-7 bg-bg-default rounded overflow-hidden shadow-sm">
                    {itemUrl && <ItemIcon iconUrl={itemUrl} altText="Item" />}
                </div>
            ))}
            {/* Relleno visual */}
            {Array.from({ length: 7 - match.items.length }).map((_, i) => (
                 <div key={`empty-${i}`} className="w-7 h-7 bg-bg-default/30 rounded" />
            ))}
         </div>
      </div>

      {/* === COL 5: JUGADORES (Lista Completa) === */}
      <div className="hidden lg:flex h-full items-center pl-3 border-l border-white/5">
         <div className="grid grid-cols-2 gap-x-2 w-full">
            {/* Team Blue (100) */}
            <div className="flex flex-col gap-0.5">
               {teamBlue.map(renderParticipantRow)}
            </div>
            {/* Team Red (200) */}
            <div className="flex flex-col gap-0.5">
               {teamRed.map(renderParticipantRow)}
            </div>
         </div>
      </div>

    </div>
  );
};

export default MatchHistoryItem;