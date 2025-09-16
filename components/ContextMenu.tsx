import React, { useEffect, useRef } from 'react';
import type { ContextMenuItem } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-slate-800/90 backdrop-blur-md border border-fuchsia-500/50 rounded-md shadow-lg shadow-fuchsia-900/30 z-[1000] text-lg text-slate-200 py-1"
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => {
            if (item.isSeparator) {
                return <li key={`separator-${index}`} className="border-t border-fuchsia-500/30 my-1"></li>
            } else {
                return (
                    <li
                        key={item.label}
                        className="px-4 py-1 hover:bg-fuchsia-500/30 cursor-pointer select-none"
                        onClick={item.onClick}
                    >
                        {item.label}
                    </li>
                );
            }
        })}
      </ul>
    </div>
  );
};

export default ContextMenu;