
import React from 'react';

interface VirusWarningProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const VirusWarning: React.FC<VirusWarningProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9000] flex items-center justify-center p-4">
            <div className="border-4 border-red-600 bg-slate-900 p-8 shadow-2xl shadow-red-500/40 text-center animate-pulse">
                <h1 className="text-5xl text-red-500 mb-4 font-bold tracking-widest">
                    !! CRITICAL WARNING !!
                </h1>
                <p className="text-2xl text-slate-200 mb-8">
                    You are about to execute a potentially malicious program: <span className="text-yellow-400 font-bold">mr_smiley.exe</span>
                </p>
                <p className="text-xl text-slate-300 mb-10">
                    This action is irreversible and may result in system instability.
                    <br/>
                    Do you wish to proceed?
                </p>
                <div className="flex justify-center gap-8">
                    <button 
                        onClick={onConfirm}
                        className="px-8 py-3 bg-red-700 text-white text-2xl font-bold border-2 border-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                    >
                        &gt; PROCEED
                    </button>
                    <button 
                        onClick={onCancel}
                        className="px-8 py-3 bg-slate-700 text-white text-2xl font-bold border-2 border-slate-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                    >
                        &gt; ABORT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VirusWarning;
