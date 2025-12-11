import React from 'react';
import { type RankData } from '../../api/types/api';

interface RankDisplayProps {
    rankInfo: RankData;
    queueName: string;
}

const RankDisplay: React.FC<RankDisplayProps> = ({ rankInfo, queueName }) => {
    // Desestructuramos los datos que nos pasan
    const { tier, rank, leaguePoints, wins, losses } = rankInfo;
    const tierIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`;

    return (
        <div className="flex items-center space-x-4 p-4 bg-bg-surface rounded-lg">
            {/* Contenedor para recortar la imagen */}
            <div className='h-24 w-24 overflow-hidden rounded-full'>
                <img
                    src={tierIconUrl}
                    alt={`${tier} ${rank}`}
                    className="w-full h-full object-cover scale-150" // Ajusta el scale si es necesario
                />
            </div>

            {/* Información del rango */}
            <div>
                <p className="font-bold text-lg text-primary">{queueName}</p>
                <p className="font-semibold text-lg text-text-base">{tier} {rank}</p>
                <p className="text-sm text-text-muted">{leaguePoints} LP</p>
                <p className="text-xs text-text-muted">
                    {wins}W / {losses}L 
                    <span className='ml-2 font-semibold'>
                        ({Math.round((wins / (wins + losses)) * 100)}% Winrate)
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RankDisplay;