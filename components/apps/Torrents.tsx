
import React, { useContext } from 'react';
import { TorrentContext } from '../../contexts/TorrentContext';
import type { Torrent } from '../../types';

const TorrentRow: React.FC<{ torrent: Torrent }> = ({ torrent }) => {
    const getStatusColor = (status: Torrent['status']) => {
        switch (status) {
            case 'Downloading': return 'text-cyan-400';
            case 'Seeding': return 'text-green-400';
            case 'Error': return 'text-red-500';
            case 'Paused': return 'text-yellow-400';
            case 'Completed': return 'text-fuchsia-400';
            default: return 'text-slate-300';
        }
    };

    return (
        <tr className="border-b border-slate-700/50 hover:bg-slate-800/40">
            <td className="p-2 truncate" style={{ maxWidth: '300px' }}>{torrent.name}</td>
            <td className="p-2 text-right">{torrent.size}</td>
            <td className="p-2">
                <div className="w-full bg-slate-700 rounded-sm h-4 border border-slate-600 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 h-full transition-all duration-500 ease-linear"
                        style={{ width: `${torrent.progress}%` }}
                    />
                </div>
                 <div className="text-center text-xs mt-1">{torrent.progress.toFixed(1)}%</div>
            </td>
            <td className={`p-2 font-bold ${getStatusColor(torrent.status)}`}>{torrent.status}</td>
            <td className="p-2 text-right text-cyan-300">{torrent.downloadSpeed}</td>
            <td className="p-2 text-right text-green-300">{torrent.uploadSpeed}</td>
            <td className="p-2 text-right">{torrent.seeds}</td>
            <td className="p-2 text-right">{torrent.peers}</td>
        </tr>
    );
};

const TorrentsApp: React.FC<{ windowId: number; onClose: () => void; }> = () => {
    const { torrents } = useContext(TorrentContext);
    
    return (
        <div className="h-full w-full flex flex-col bg-slate-900/50 text-slate-300 text-base">
            <div className="flex-grow overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
                        <tr className="text-left text-fuchsia-300">
                            <th className="p-2">Name</th>
                            <th className="p-2 text-right">Size</th>
                            <th className="p-2 w-48">Progress</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-right">DL Speed</th>
                            <th className="p-2 text-right">UL Speed</th>
                            <th className="p-2 text-right">Seeds</th>
                            <th className="p-2 text-right">Peers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {torrents.length > 0 ? (
                            torrents.map(t => <TorrentRow key={t.id} torrent={t} />)
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center p-8 text-slate-500 text-xl">
                                    No active torrents.
                                    <br/>
                                    <span className="text-lg">Use 'download [url]' in the terminal.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex-shrink-0 h-8 border-t border-fuchsia-500/30 bg-slate-800/80 flex items-center px-4 justify-between">
                <div>Total Torrents: <span className="text-fuchsia-400">{torrents.length}</span></div>
                <div>Status: Connected</div>
            </div>
        </div>
    );
};

export default TorrentsApp;
