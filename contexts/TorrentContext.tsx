
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Torrent } from '../types';

// Define known fake torrents
const fakeTorrentsDB: { [key: string]: Omit<Torrent, 'id' | 'progress' | 'status' | 'downloadSpeed' | 'uploadSpeed' | 'peers' | 'seeds'> } = {
    'karate-kid': {
        name: 'Karate.Kid.Legends.2025.1080p.WEBRip.x264-YTS.MX.mp4',
        size: '2.15 GB',
        totalSizeMB: 2150,
    },
    'hackers': {
        name: 'Hackers.1995.Collectors.Edition.1080p.BluRay.x265-RARBG.mkv',
        size: '4.50 GB',
        totalSizeMB: 4500,
    }
};

interface TorrentContextType {
    torrents: Torrent[];
    addTorrent: (url: string) => boolean;
}

export const TorrentContext = createContext<TorrentContextType>({
    torrents: [],
    addTorrent: () => false,
});

export const TorrentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [torrents, setTorrents] = useState<Torrent[]>([]);

    const addTorrent = useCallback((url: string): boolean => {
        let torrentDataKey: string | null = null;
        const lowerUrl = url.toLowerCase();

        if (lowerUrl.includes('yts.mx') || lowerUrl.includes('karate-kid') || lowerUrl.includes('ba6cad6476f5328eff646ae549a39c61705244c8')) {
            torrentDataKey = 'karate-kid';
        } else if (lowerUrl.includes('hackers')) {
            torrentDataKey = 'hackers';
        }

        if (!torrentDataKey) return false;

        const torrentData = fakeTorrentsDB[torrentDataKey];
        const id = btoa(torrentData.name).slice(0, 20); // Create a pseudo-unique id
        
        // Prevent adding duplicates
        if (torrents.some(t => t.id === id)) {
            return true;
        }

        const newTorrent: Torrent = {
            id,
            ...torrentData,
            progress: 0,
            status: 'Downloading',
            downloadSpeed: '0 KB/s',
            uploadSpeed: '0 KB/s',
            peers: 0,
            seeds: 0,
        };
        setTorrents(prev => [...prev, newTorrent]);
        return true;
    }, [torrents]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTorrents(currentTorrents =>
                currentTorrents.map(torrent => {
                    if (torrent.status === 'Downloading' && torrent.progress < 100) {
                        const newProgress = Math.min(100, torrent.progress + Math.random() * 0.5);
                        const isCompleted = newProgress >= 100;
                        
                        return {
                            ...torrent,
                            progress: newProgress,
                            status: isCompleted ? 'Seeding' : 'Downloading',
                            downloadSpeed: isCompleted ? '0 KB/s' : `${(Math.random() * 1500 + 500).toFixed(2)} KB/s`,
                            uploadSpeed: isCompleted ? `${(Math.random() * 250 + 50).toFixed(2)} KB/s` : `${(Math.random() * 50).toFixed(2)} KB/s`,
                            peers: Math.floor(Math.random() * 20 + 5),
                            seeds: Math.floor(Math.random() * 50 + 10),
                        };
                    }
                    if (torrent.status === 'Seeding') {
                        return {
                            ...torrent,
                            uploadSpeed: `${(Math.random() * 250 + 50).toFixed(2)} KB/s`,
                            peers: Math.floor(Math.random() * 20 + 5),
                            seeds: Math.floor(Math.random() * 50 + 10),
                        }
                    }
                    return torrent;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <TorrentContext.Provider value={{ torrents, addTorrent }}>
            {children}
        </TorrentContext.Provider>
    );
};
