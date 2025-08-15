// app/components/LeaderboardSection.tsx
"use client";
import React from 'react';
import { Trophy } from 'lucide-react';

interface Player {
  rank: number;
  name: string;
  score: string;
  prize: string;
}

const LeaderboardSection = () => {
    const players: Player[] = [
        { rank: 1, name: 'ProGamer123', score: '2500', prize: '₹8,00,000' },
        { rank: 2, name: 'Streaming', score: '2300', prize: '₹4,00,000' },
        { rank: 3, name: 'GameMaster', score: '2200', prize: '₹2,00,000' },
        { rank: 4, name: 'ElitePlayer', score: '2100', prize: '₹80,000' },
        { rank: 5, name: 'TopStreamer', score: '2000', prize: '₹40,000' },
    ];
    return (
        <section className="py-16 sm:py-24 px-4 sm:px-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold flex items-center gap-3"><Trophy className="text-emerald-500" /> Tournament Leaderboard</h2></div>
                <div className="bg-[#181818]/50 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="border-b border-gray-700/50"><tr>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Rank</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Player</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Score</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider text-right">Prize</th>
                            </tr></thead>
                            <tbody>{players.map((player) => (
                                <tr key={player.rank} className="border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-bold text-lg">
                                        <div className="w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-full">
                                            {player.rank}
                                        </div>
                                    </td>
                                    <td className="p-4">{player.name}</td>
                                    <td className="p-4 text-gray-400">{player.score}</td>
                                    <td className="p-4 text-right font-semibold text-emerald-500">{player.prize}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeaderboardSection;
