
import React from 'react';

const Welcome: React.FC<{ windowId: number; onClose: () => void }> = () => {
  return (
    <div className="p-2 text-lg leading-relaxed text-slate-300">
      <h1 className="text-2xl text-fuchsia-400 mb-4">> Welcome, Guest User.</h1>
      <p className="mb-2">This cloud rig is hot-wired into the net. 
      You're running a custom build of the Puter OS, Hack'd Up Edition v0.4.2.0.</p>
      <p className="mb-2">The icons on your desktop are your entry points. The Terminal is your weapon of choice, ninja. A new "toy" has been added: 'Mr. Smiley'. Don't click it. Don't even look at it too long!</p>
      <p className="mb-4">Use the system wisely.</p>
      <p className="text-yellow-400">> infopirate_x86</p>
    </div>
  );
};

export default Welcome;