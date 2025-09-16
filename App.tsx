
import React, { useState } from 'react';
import Desktop from './components/Desktop';
import VirusEffect from './components/VirusEffect';
import { TorrentProvider } from './contexts/TorrentContext';

function App() {
  const [virusActive, setVirusActive] = React.useState(false);

  return (
    <TorrentProvider>
      <div className="font-vt323 bg-black text-slate-300 w-screen h-screen overflow-hidden">
        <Desktop onVirusActivate={() => setVirusActive(true)} />
        {virusActive && <VirusEffect />}
      </div>
    </TorrentProvider>
  );
}

export default App;
