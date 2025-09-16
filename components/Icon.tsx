
import React, { ReactNode } from 'react';

interface IconProps {
    label: string;
    icon: ReactNode;
    onDoubleClick: () => void;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    isSelected: boolean;
}

const Icon: React.FC<IconProps> = ({ label, icon, onDoubleClick, onClick, onContextMenu, isSelected }) => {
    return (
        <div
            className={`flex flex-col items-center gap-2 text-center w-24 cursor-pointer p-2 rounded-md transition-colors duration-200 border-2 ${isSelected ? 'bg-fuchsia-500/20 border-fuchsia-400/50' : 'border-transparent hover:bg-fuchsia-500/10'}`}
            onDoubleClick={onDoubleClick}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
                onContextMenu(e);
            }}
        >
            <div className="text-slate-300">
                {icon}
            </div>
            <span className="text-lg text-slate-200 select-none">{label}</span>
        </div>
    );
};

export default Icon;
