
import React, { useState, useRef, useEffect, useContext } from 'react';
import { askGemini } from '../../services/geminiService';
import { TorrentContext } from '../../contexts/TorrentContext';

interface TerminalLine {
    type: 'input' | 'output' | 'error' | 'system';
    content: string;
}

interface TerminalProps {
    windowId: number;
    onClose: () => void;
    onTriggerVirusWarning?: () => void;
}

const Terminal: React.FC<TerminalProps> = (props) => {
    const { windowId, onClose, onTriggerVirusWarning } = props;
    const { addTorrent } = useContext(TorrentContext);
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'system', content: "CEREBRO AI v2.5 Online. Type 'help' for commands." }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectedHost, setConnectedHost] = useState<string | null>(null);
    const endOfTerminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const addHistory = (line: TerminalLine) => {
        setHistory(prev => [...prev, line]);
    }

    const handleCommand = async (command: string) => {
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        addHistory({ type: 'input', content: `${connectedHost ? `[${connectedHost}]~#` : '>'} ${command}` });
        setIsProcessing(true);

        switch (cmd) {
            case 'help':
                addHistory({ type: 'output', content: "Available commands:\n  ask [question]         - Query the CEREBRO AI.\n  download [url]         - Download a file via torrent.\n  connect [ip]           - Connect to a remote host.\n  scan/probe             - Scan remote host (must be connected).\n  disconnect             - Disconnect from remote host.\n  run [program]          - Execute a program (e.g., mr_smiley.exe).\n  sysinfo, ls, cat, clear, exit - Standard commands." });
                break;
            case 'ask':
                if (args.length === 0) {
                    addHistory({ type: 'error', content: "Usage: ask [your question]" });
                } else {
                    addHistory({ type: 'system', content: ">>> Accessing CEREBRO AI..." });
                    const response = await askGemini(args.join(' '));
                    addHistory({ type: 'output', content: response });
                }
                break;
            case 'download':
                if (args.length === 0) {
                    addHistory({ type: 'error', content: "Usage: download [url | magnet_link]" });
                } else {
                    addHistory({ type: 'system', content: `Analyzing link: ${args[0]}` });
                    await new Promise(res => setTimeout(res, 500));
                    const success = addTorrent(args[0]);
                    if (success) {
                        addHistory({ type: 'system', content: `Torrent added. Open the Torrents app to see progress.` });
                    } else {
                        addHistory({ type: 'error', content: 'Could not parse link or find torrent data.' });
                    }
                }
                break;
            case 'sysinfo':
                addHistory({ type: 'output', content: "System: PuterOS HE 2.0\nCPU: RISC-V Fusion @ 8.1GHz\nAI: CEREBRO v2.5\nStatus: Hacking the Planet..." });
                break;
            case 'ls':
                 addHistory({ type: 'output', content: "gibson_mainframe.log\tpasswords.txt\tmanifesto.txt\nmr_smiley.exe\t\tcookie.jar\tda_vinci_virus.exe" });
                break;
            case 'cat':
                if (args[0] === 'manifesto.txt') {
                    addHistory({ type: 'output', content: `"This is our world now... the world of the electron and the switch... We exist without skin color, without nationality, without religious bias... and you call us criminals. Yes, I am a criminal. My crime is that of curiosity."\n- The Mentor` });
                } else if (args.length > 0) {
                     addHistory({ type: 'error', content: `cat: ${args[0]}: File is encrypted with 4096-bit RSA. Nice try.` });
                } else {
                    addHistory({ type: 'error', content: 'Usage: cat [filename]' });
                }
                break;
            case 'run':
                if (args[0] === 'mr_smiley.exe') {
                    addHistory({ type: 'system', content: 'Executing mr_smiley.exe...'});
                    onTriggerVirusWarning?.();
                } else {
                    addHistory({ type: 'error', content: `run: cannot find executable '${args[0]}'` });
                }
                break;
            case 'connect':
                if (args.length === 1) {
                    addHistory({ type: 'system', content: `Connecting to ${args[0]}...` });
                    await new Promise(res => setTimeout(res, 1000));
                    addHistory({ type: 'system', content: `Connection established. Uplink active.` });
                    setConnectedHost(args[0]);
                } else {
                    addHistory({ type: 'error', content: 'Usage: connect [ip_address]' });
                }
                break;
            case 'scan':
            case 'probe':
                if (connectedHost) {
                     addHistory({ type: 'system', content: `Scanning ${connectedHost}...` });
                     await new Promise(res => setTimeout(res, 1500));
                     addHistory({ type: 'output', content: `Port 21 (FTP)\t\t- OPEN\nPort 22 (SSH)\t\t- OPEN\nPort 80 (HTTP)\t\t- OPEN\nPort 443 (HTTPS)\t- OPEN\nPort 8080 (proxy)\t- OPEN`});
                } else {
                     addHistory({ type: 'error', content: 'Error: Not connected to any host.' });
                }
                break;
            case 'disconnect':
                if (connectedHost) {
                    addHistory({ type: 'system', content: `Disconnecting from ${connectedHost}...` });
                    setConnectedHost(null);
                } else {
                     addHistory({ type: 'error', content: 'Error: Not connected to any host.' });
                }
                break;
            case 'clear':
                setHistory([]);
                break;
            case 'exit':
                onClose();
                break;
            case '':
                break;
            default:
                addHistory({ type: 'error', content: `Command not found: ${cmd}. Type 'help'.` });
                break;
        }

        setIsProcessing(false);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleCommand(input);
        }
    };
    
    const promptSymbol = connectedHost ? `[${connectedHost}]~#` : '>';

    return (
        <div className="w-full h-full bg-black/80 flex flex-col p-2 text-lg" onClick={() => document.getElementById(`terminal-input-${windowId}`)?.focus()}>
            <div className="flex-grow overflow-y-auto pr-2">
                {history.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                        {line.type === 'input' && <span className="text-fuchsia-400">{line.content}</span>}
                        {line.type === 'output' && <span className="text-slate-300">{line.content}</span>}
                        {line.type === 'error' && <span className="text-red-500">{line.content}</span>}
                        {line.type === 'system' && <span className="text-yellow-400">{line.content}</span>}
                    </div>
                ))}
                 <div ref={endOfTerminalRef} />
            </div>
            <div className="flex mt-2">
                <span className="text-fuchsia-400">{promptSymbol}</span>
                <input
                    id={`terminal-input-${windowId}`}
                    type="text"
                    className="flex-grow bg-transparent border-none text-slate-200 focus:outline-none focus:ring-0 ml-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Terminal;
