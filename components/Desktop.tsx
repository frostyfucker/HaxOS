
import React, { useState, useCallback, ReactNode, useRef } from 'react';
import type { AppConfig, WindowInstance, ContextMenuItem } from '../types';
import Window from './Window';
import Icon from './Icon';
import Dock from './Dock';
import ContextMenu from './ContextMenu';
import VirusWarning from './VirusWarning';
import Terminal from './apps/Terminal';
import Notepad from './apps/Notepad';
import About from './apps/About';
import Welcome from './apps/Welcome';
import TorrentsApp from './apps/Torrents';

const TerminalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
);

const NotepadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const AboutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
);

const MrSmileyIcon = () => (
    <svg className="h-12 w-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFD700" stroke="black" strokeWidth="2"/>
      <path d="M 20 40 C 20 30, 30 30, 40 40 L 40 50 L 20 50 Z" fill="black"/>
      <path d="M 60 40 C 70 30, 80 30, 80 40 L 80 50 L 60 50 Z" fill="black"/>
      <rect x="40" y="38" width="20" height="5" fill="black"/>
      <path d="M 30 70 Q 50 85, 70 70" stroke="black" strokeWidth="4" fill="transparent"/>
    </svg>
);

const TorrentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const APPS: AppConfig[] = [
  { id: 'welcome', title: 'README.txt', icon: <NotepadIcon />, component: Welcome, defaultSize: { width: 500, height: 400 } },
  { id: 'terminal', title: 'Terminal', icon: <TerminalIcon />, component: Terminal, defaultSize: { width: 640, height: 480 } },
  { id: 'torrents', title: 'Torrents', icon: <TorrentIcon />, component: TorrentsApp, defaultSize: { width: 800, height: 500 } },
  { id: 'notepad', title: 'Notepad', icon: <NotepadIcon />, component: Notepad, defaultSize: { width: 500, height: 400 } },
  { id: 'about', title: 'About This Rig', icon: <AboutIcon />, component: About, defaultSize: { width: 450, height: 350 } },
  { id: 'virus', title: 'Mr. Smiley', icon: <MrSmileyIcon /> },
];

const Desktop: React.FC<{onVirusActivate: () => void}> = ({ onVirusActivate }) => {
    const [windows, setWindows] = useState<WindowInstance[]>([
        { id: Date.now(), appId: 'welcome', title: 'README.txt', position: { x: 150, y: 100 }, size: { width: 500, height: 400 }, zIndex: 10, isMinimized: false, isMaximized: false }
    ]);
    const [activeWindowId, setActiveWindowId] = useState<number>(windows.length > 0 ? windows[0].id : -1);
    const zIndexCounter = React.useRef(windows.length > 0 ? 11 : 1);
    const desktopRef = useRef<HTMLDivElement>(null);
    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
    const [isVirusWarningVisible, setIsVirusWarningVisible] = useState(false);

    const openApp = useCallback((appId: string) => {
        setContextMenu(null);
        if (appId === 'virus') {
            setIsVirusWarningVisible(true);
            return;
        }

        const appConfig = APPS.find(app => app.id === appId);
        if (!appConfig || !appConfig.component) return;

        const newWindow: WindowInstance = {
            id: Date.now(),
            appId: appConfig.id,
            title: appConfig.title,
            position: { x: Math.random() * 200 + 50, y: Math.random() * 150 + 50 },
            size: appConfig.defaultSize || { width: 600, height: 400 },
            zIndex: zIndexCounter.current++,
            isMinimized: false,
            isMaximized: false,
        };
        setWindows(prev => [...prev, newWindow]);
        setActiveWindowId(newWindow.id);
    }, []);
    
    const handleDesktopClick = () => {
        setSelectedIconId(null);
        setContextMenu(null);
    };

    const handleIconContextMenu = (e: React.MouseEvent, appId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIconId(appId);
        
        const menuItems: ContextMenuItem[] = [
            { label: 'Open', onClick: () => openApp(appId) },
            { isSeparator: true },
            { label: 'Properties', onClick: () => openApp('about') }
        ];
        
        setContextMenu({ x: e.clientX, y: e.clientY, items: menuItems });
    };

    const handleDesktopContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedIconId(null);
        
        const appItems = APPS
            .filter(app => app.component) // only show apps that can be opened
            .map(app => ({
                label: `Open ${app.title}`,
                onClick: () => openApp(app.id)
            }));
            
        const menuItems: ContextMenuItem[] = [
            ...appItems,
            { isSeparator: true },
            { label: "About This Rig", onClick: () => openApp('about') }
        ];

        setContextMenu({ x: e.clientX, y: e.clientY, items: menuItems });
    };

    const closeWindow = useCallback((id: number) => {
        setWindows(prev => {
            const remainingWindows = prev.filter(win => win.id !== id);
            if (activeWindowId === id) {
                if (remainingWindows.length > 0) {
                    const topWindow = [...remainingWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
                    setActiveWindowId(topWindow.id);
                } else {
                    setActiveWindowId(-1);
                }
            }
            return remainingWindows;
        });
    }, [activeWindowId]);

    const focusWindow = useCallback((id: number) => {
        setWindows(prev => prev.map(win => 
            win.id === id ? { ...win, zIndex: zIndexCounter.current++, isMinimized: false } : win
        ));
        setActiveWindowId(id);
    }, []);
    
    const handleWindowGeometryChange = useCallback((id: number, newGeometry: { position: {x: number, y: number}, size: {width: number, height: number} }) => {
        setWindows(prev => prev.map(win => 
            win.id === id ? { ...win, position: newGeometry.position, size: newGeometry.size } : win
        ));
    }, []);

    const toggleMaximize = useCallback((id: number) => {
        const desktopSize = desktopRef.current?.getBoundingClientRect();
        if (!desktopSize) return;
        const dockHeight = 48;

        setWindows(prev => prev.map(win => {
            if (win.id === id) {
                if (win.isMaximized) {
                    return { ...win, isMaximized: false, position: win.previousPosition || { x: 50, y: 50 }, size: win.previousSize || { width: 600, height: 400 } };
                } else {
                    return { ...win, isMaximized: true, previousPosition: win.position, previousSize: win.size, position: { x: 0, y: 0 }, size: { width: desktopSize.width, height: desktopSize.height - dockHeight } };
                }
            }
            return win;
        }));
        focusWindow(id);
    }, [focusWindow]);

    const toggleMinimize = useCallback((id: number) => {
        setWindows(prev => prev.map(win => 
            win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
        ));
        if(activeWindowId === id) {
            setActiveWindowId(-1);
        }
    }, [activeWindowId]);

    const getAppById = (appId: string) => APPS.find(app => app.id === appId);

    return (
        <div 
            ref={desktopRef} 
            className="w-full h-full bg-slate-900 relative isolate bg-black"
            onClick={handleDesktopClick}
            onContextMenu={handleDesktopContextMenu}
        >
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            <div className="absolute top-8 left-8 flex flex-col gap-4">
                {APPS.map(app => (
                    app.id !== 'welcome' && (
                       <Icon 
                         key={app.id} 
                         label={app.title} 
                         icon={app.icon} 
                         isSelected={selectedIconId === app.id}
                         onClick={() => setSelectedIconId(app.id)}
                         onDoubleClick={() => openApp(app.id)} 
                         onContextMenu={(e) => handleIconContextMenu(e, app.id)}
                       />
                    )
                ))}
            </div>

            {windows.filter(win => !win.isMinimized).map(winData => {
                const App = getAppById(winData.appId)?.component;
                return (
                    App &&
                    <Window 
                        key={winData.id}
                        title={winData.title}
                        position={winData.position}
                        size={winData.size}
                        zIndex={winData.zIndex}
                        isActive={winData.id === activeWindowId}
                        isMaximized={winData.isMaximized}
                        onClose={() => closeWindow(winData.id)}
                        onFocus={() => focusWindow(winData.id)}
                        onMinimize={() => toggleMinimize(winData.id)}
                        onMaximize={() => toggleMaximize(winData.id)}
                        onGeometryChange={(geom) => handleWindowGeometryChange(winData.id, geom)}
                    >
                        <App 
                            windowId={winData.id} 
                            onClose={() => closeWindow(winData.id)} 
                            onTriggerVirusWarning={() => setIsVirusWarningVisible(true)}
                        />
                    </Window>
                )
            })}
            
            {contextMenu && (
                <ContextMenu 
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={contextMenu.items}
                    onClose={() => setContextMenu(null)}
                />
            )}
            
            {isVirusWarningVisible && (
                <VirusWarning 
                    onConfirm={() => {
                        setIsVirusWarningVisible(false);
                        onVirusActivate();
                    }}
                    onCancel={() => setIsVirusWarningVisible(false)}
                />
            )}

            <Dock openWindows={windows} onFocus={focusWindow} activeWindowId={activeWindowId} />
        </div>
    );
};

export default Desktop;
