import React from 'react';
import { type RankData } from '../../api/types/api';

interface SummonerRankProps {
    ranks: RankData[];
}

const SummonerRank: React.FC<SummonerRankProps> = ({ ranks }) => {
    const soloDuoRank = ranks.find(rank => rank.queueType === 'RANKED_SOLO_5x5');

    if (!soloDuoRank) {
        return <p className="text-gray-500 italic">Unranked</p>;
    }

    const { tier, rank, leaguePoints, wins, losses } = soloDuoRank;

    const tierIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`;

    return (
    <div className="flex items-center space-x-4 p-4 mt-4 bg-bg-surface rounded-lg">
      <div className='h-24 w-24 overflow-hidden'>
      <img
        src={tierIconUrl}
        alt={`${tier} ${rank}`}
        className="w-full h-full pt-0.5 object-cover scale-300"
      />
      </div>
      <div className='ml-0.5 pl-0.5'>
        <p className="font-semibold text-lg text-text-base">{tier} {rank}</p>
        <p className="text-sm text-text-base">{leaguePoints} LP</p>
        <p className="text-xs text-text-base">Victorias: {wins} / Derrotas: {losses}</p>
      </div>
    </div>
  );
};


export default SummonerRank;
