
import React from 'react';

export type ContextMenuItem =
  | {
      label: string;
      onClick: () => void;
      isSeparator?: false;
    }
  | {
      isSeparator: true;
    };

export interface AppConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  component?: React.ComponentType<{ 
    windowId: number; 
    onClose: () => void;
    onTriggerVirusWarning?: () => void; 
  }>;
  defaultSize?: { width: number; height: number };
}

export interface WindowInstance {
  id: number;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number; height: number };
}

export interface Torrent {
    id: string;
    name: string;
    size: string;
    totalSizeMB: number; // For progress calculation
    progress: number; // 0-100
    status: 'Downloading' | 'Seeding' | 'Paused' | 'Error' | 'Completed';
    downloadSpeed: string;
    uploadSpeed: string;
    peers: number;
    seeds: number;
}
