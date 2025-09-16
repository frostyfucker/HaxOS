
import React, { useState, useEffect } from 'react';
import type { WindowInstance } from '../types';

interface DockProps {
  openWindows: WindowInstance[];
  onFocus: (id: number) => void;
  activeWindowId: number | null;
}

const Dock: React.FC<DockProps> = ({ openWindows, onFocus, activeWindowId }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  
  const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/70 backdrop-blur-md border-t-2 border-fuchsia-500/30 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <div className="text-xl text-fuchsia-400">[ GIBSON ]</div>
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onFocus(win.id)}
            className={`px-3 py-1 text-lg rounded-md border-b-2 transition-all duration-200 ${
              win.id === activeWindowId ? 'bg-fuchsia-500/30 border-fuchsia-400 text-white' : 'bg-slate-700/50 border-transparent text-slate-300 hover:bg-slate-600/50'
            } ${win.isMinimized ? 'opacity-60 italic' : ''}`}
          >
            {win.title}
          </button>
        ))}
      </div>
      <div className="text-xl text-fuchsia-300">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Dock;