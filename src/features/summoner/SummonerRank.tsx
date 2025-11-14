// src/components/SummonerRank.tsx
import React from 'react';
import { type RankData } from '../../api/types/api';
import RankDisplay from './RankDisplay';

// --- PASO 1: Crea un componente reutilizable para mostrar UN solo rango ---
// Este componente no sabe si es Flex o Solo/Duo, solo recibe los datos y los muestra.


// --- PASO 2: Modifica tu componente principal para que use el nuevo componente ---
interface SummonerRankProps {
    ranks: RankData[];
}

const SummonerRank: React.FC<SummonerRankProps> = ({ ranks }) => {
    // Buscamos los datos de cada cola, como ya lo hacías
    const soloDuoRank = ranks.find(rank => rank.queueType === 'RANKED_SOLO_5x5');
    const flexibleRank = ranks.find(rank => rank.queueType === 'RANKED_FLEX_SR');

    // Si no tiene rango en NINGUNA de las dos colas, mostramos un mensaje general.
    if (!soloDuoRank && !flexibleRank) {
        return <p className="text-text-muted italic mt-4">El jugador no tiene rango esta temporada.</p>;
    }

    return (
        // Un contenedor para ambos rangos, apilados verticalmente
        <div className="flex flex-col space-y-4 mt-4 w-full max-w-md">
            {/* Condición para Solo/Duo */}
            {soloDuoRank ? (
                // Si tiene rango, usamos nuestro nuevo componente
                <RankDisplay rankInfo={soloDuoRank} queueName="Ranked Solo/Duo" />
            ) : (
                // Si no, mostramos un mensaje específico para esa cola
                <div className='p-4 bg-bg-surface rounded-lg text-text-muted italic'>
                    Ranked Solo/Duo: Unranked
                </div>
            )}

            {/* Condición para Flex */}
            {flexibleRank ? (
                // Si tiene rango, reusamos el mismo componente con los datos de Flex
                <RankDisplay rankInfo={flexibleRank} queueName="Ranked Flex" />
            ) : (
                // Si no, mostramos el mensaje de unranked
                <div className='p-4 bg-bg-surface rounded-lg text-text-muted italic'>
                    Ranked Flex: Unranked
                </div>
            )}
        </div>
    );
};

export default SummonerRank;
