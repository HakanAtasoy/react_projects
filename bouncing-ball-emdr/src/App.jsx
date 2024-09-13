// src/App.js
import { useState } from 'react';
import { BouncingBallScene, Controls } from './components';

function App() {
  const [color, setColor] = useState('#ff0000');
  const [speed, setSpeed] = useState(0.1);
  const [playSound, setPlaySound] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false); 



  return (
    <div>
      <h1>Bouncing Ball EMDR Tool</h1>
      <div style={{ height: '400px', width: '100%' }}>
        <BouncingBallScene 
            color={color} 
            speed={Number(speed)} 
            playSound={playSound} 
            isPaused={isPaused}
            showBoundaries={showBoundaries}
        />
      </div>
      <Controls
        onColorChange={setColor}
        onSpeedChange={setSpeed}
        onPlaySoundChange={setPlaySound}
        onPauseToggle={setIsPaused}
        onBoundariesToggle={setShowBoundaries}
      />
    </div>
  );
}

export default App;
