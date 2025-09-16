
import React from 'react';

const About: React.FC<{ windowId: number; onClose: () => void }> = () => {
    const specs = [
        { label: "OS", value: "Forked from PuterOS: Hack'd Up Edition v0.4.2.0-basic" },
        { label: "Kernel", value: "6.6.6-1337HACKER" },
        { label: "Uptime", value: "93w 4d 1h 18m" },
        { label: "CPU", value: "RISC-V Fusion @ 8.1GHz (OC)" },
        { label: "GPU", value: "Tesla SuperPacks CM-900b GPU's" },
        { label: "Gaze I/O", value: "Disabled: WebGazer Sub-system v1.1" },
        { label: "AI/LLM Core", value: "ollama-Genie-v4.2.0" },
    ];

  return (
    <div className="p-2 text-lg">
      <div className="flex gap-4">
        <div className="text-8xl text-fuchsia-400 select-none">
          <pre>
{`
  /\\_/\\
 ( o.o )
  > ^ <
`}
          </pre>
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl text-fuchsia-300 mb-2">infopirate_x86's Cloud-VM-Rig</h1>
          <div className="border-t-2 border-fuchsia-400/50 w-full mb-2"></div>
          {specs.map(spec => (
              <div key={spec.label} className="flex">
                  <span className="w-28 text-fuchsia-300">{spec.label}:</span>
                  <span className="text-slate-300">{spec.value}</span>
              </div>
          ))}
        </div>
      </div>
       <p className="mt-4 text-sm text-slate-400">"This is it. This is the future. This is... like, the future." - Phreak</p>
    </div>
  );
};

export default About;