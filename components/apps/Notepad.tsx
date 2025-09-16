
import React from 'react';

const Notepad: React.FC<{ windowId: number; onClose: () => void }> = () => {
    return (
        <textarea 
            className="w-full h-full bg-transparent border-0 text-slate-200 text-lg focus:outline-none focus:ring-0 resize-none p-1"
            defaultValue="// Type your elite hacking notes here..."
        />
    );
};

export default Notepad;