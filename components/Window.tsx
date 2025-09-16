
import React, { ReactNode, useCallback } from 'react';
import { useDraggable } from '../hooks/useDraggable';

interface WindowProps {
    title: string;
    children: ReactNode;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    isActive: boolean;
    isMaximized: boolean;
    onClose: () => void;
    onFocus: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onGeometryChange: (geometry: { position: {x: number, y: number}, size: {width: number, height: number} }) => void;
}

const resizeHandles = [
  { name: 'top-left', cursor: 'nwse-resize', styles: 'top-0 left-0' },
  { name: 'top', cursor: 'ns-resize', styles: 'top-0 left-1/2 -translate-x-1/2 w-full h-1' },
  { name: 'top-right', cursor: 'nesw-resize', styles: 'top-0 right-0' },
  { name: 'right', cursor: 'ew-resize', styles: 'top-1/2 right-0 -translate-y-1/2 w-1 h-full' },
  { name: 'bottom-right', cursor: 'nwse-resize', styles: 'bottom-0 right-0' },
  { name: 'bottom', cursor: 'ns-resize', styles: 'bottom-0 left-1/2 -translate-x-1/2 w-full h-1' },
  { name: 'bottom-left', cursor: 'nesw-resize', styles: 'bottom-0 left-0' },
  { name: 'left', cursor: 'ew-resize', styles: 'top-1/2 left-0 -translate-y-1/2 w-1 h-full' },
];

const Window: React.FC<WindowProps> = (props) => {
    const { title, children, position, size, zIndex, isActive, isMaximized, onClose, onFocus, onMinimize, onMaximize, onGeometryChange } = props;
    
    const onDrag = useCallback((newPos: {x: number, y: number}) => {
        onGeometryChange({ position: newPos, size });
    }, [size, onGeometryChange]);

    const { elementRef, handleMouseDown: handleDragMouseDown } = useDraggable({
        initialPosition: position,
        onDragStart: onFocus,
        onDrag,
    });
    
    const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, handle: string) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus();

        const startPos = { ...position };
        const startSize = { ...size };
        const startMouse = { x: e.clientX, y: e.clientY };

        const doResize = (moveEvent: MouseEvent) => {
            let newWidth = startSize.width;
            let newHeight = startSize.height;
            let newX = startPos.x;
            let newY = startPos.y;

            const dx = moveEvent.clientX - startMouse.x;
            const dy = moveEvent.clientY - startMouse.y;
            
            const minWidth = 250;
            const minHeight = 150;

            if (handle.includes('right')) newWidth = Math.max(minWidth, startSize.width + dx);
            if (handle.includes('bottom')) newHeight = Math.max(minHeight, startSize.height + dy);
            if (handle.includes('left')) {
                const potentialWidth = startSize.width - dx;
                if (potentialWidth > minWidth) {
                    newWidth = potentialWidth;
                    newX = startPos.x + dx;
                }
            }
            if (handle.includes('top')) {
                 const potentialHeight = startSize.height - dy;
                if (potentialHeight > minHeight) {
                    newHeight = potentialHeight;
                    newY = startPos.y + dy;
                }
            }
            
            onGeometryChange({ position: { x: newX, y: newY }, size: { width: newWidth, height: newHeight }});
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);

    }, [position, size, onFocus, onGeometryChange]);

    const activeClasses = 'border-fuchsia-500/80 shadow-lg shadow-fuchsia-500/20';
    const inactiveClasses = 'border-slate-700';
    
    const windowStyle = isMaximized ? {
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 48px)',
        zIndex,
    } : {
        top: `${position.y}px`, 
        left: `${position.x}px`, 
        width: `${size.width}px`, 
        height: `${size.height}px`,
        zIndex,
        minWidth: '250px',
        minHeight: '150px',
    };

    return (
        <div
            ref={elementRef}
            className={`font-vt323 absolute flex flex-col bg-slate-900/80 backdrop-blur-sm border-2 rounded-t-lg ${isActive ? activeClasses : inactiveClasses}`}
            style={windowStyle}
            onMouseDown={onFocus}
        >
             {!isMaximized && resizeHandles.map(({ name, cursor, styles }) => (
                <div
                    key={name}
                    className={`absolute ${styles} z-10`}
                    style={{ cursor: cursor }}
                    onMouseDown={(e) => handleResizeMouseDown(e, name)}
                >
                    { name.length > 5 && <div className={`w-2 h-2`}/> }
                </div>
            ))}

            <div
                className={`flex items-center justify-between p-1 pl-3 text-lg ${isMaximized ? '' : 'cursor-grab'} ${isActive ? 'bg-gradient-to-r from-fuchsia-900/50 via-slate-800/50 to-slate-800/50' : 'bg-slate-800/50'}`}
                onMouseDown={!isMaximized ? handleDragMouseDown : undefined}
            >
                <span className={`select-none ${isActive ? 'text-fuchsia-300' : 'text-slate-400'}`}>{title}</span>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-6 h-6 bg-yellow-500/80 hover:bg-yellow-400 rounded-full border border-yellow-600 focus:outline-none flex items-center justify-center text-black font-bold text-lg">_</button>
                    <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-6 h-6 bg-green-500/80 hover:bg-green-400 rounded-full border border-green-600 focus:outline-none flex items-center justify-center text-black font-bold text-xl leading-none">
                        {isMaximized ? '🗗' : '□'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded-full border border-red-700 focus:outline-none flex items-center justify-center text-black font-bold">X</button>
                </div>
            </div>
            <div className="flex-grow p-2 overflow-auto text-slate-300 bg-slate-800/50">
                {children}
            </div>
        </div>
    );
};

export default Window;