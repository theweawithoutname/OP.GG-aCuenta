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
    <div className="flex items-center space-x-4 p-4 mt-4 bg-gray-50 border rounded-lg">
      <img
        src={tierIconUrl}
        alt={`${tier} ${rank}`}
        className="w-16 h-16"
      />
      <div>
        <p className="font-semibold text-lg">{tier} {rank}</p>
        <p className="text-sm text-gray-600">{leaguePoints} LP</p>
        <p className="text-xs text-gray-400">Victorias: {wins} / Derrotas: {losses}</p>
      </div>
    </div>
  );
};


export default SummonerRank;
