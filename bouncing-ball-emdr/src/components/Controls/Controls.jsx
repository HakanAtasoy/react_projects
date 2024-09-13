import { useState } from 'react';
import PropTypes from 'prop-types';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS


const Controls = ({ onColorChange, onSpeedChange, onPlaySoundChange, onPauseToggle, onBoundariesToggle }) => {
  const [color, setColor] = useState('#ff0000');
  const [speed, setSpeed] = useState(1);
  const [playSound, setPlaySound] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false); 



  const handleColorChange = (e) => {
    setColor(e.target.value);
    onColorChange(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
    onSpeedChange(e.target.value);
  };

  const handleSoundToggle = () => {
    setPlaySound(!playSound);
    onPlaySoundChange(!playSound);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    onPauseToggle(!isPaused);
  };

  const handleBoundariesToggle = () => {
    setShowBoundaries(!showBoundaries);
    onBoundariesToggle(!showBoundaries);
  };

  return (
    <div>
      <div>
        <label>Color:</label>
        <input type="color" value={color} onChange={handleColorChange} />
      </div>
      <div>
        <label>Speed:</label>
        <input type="range" min="0.1" max="10" step="0.2" value={speed} onChange={handleSpeedChange} />
      </div>
      <div>
        <label>Sound:</label>
        <input type="checkbox" checked={playSound} onChange={handleSoundToggle} />
      </div>
      <div>
        <label style={{ marginRight: '10px' }} >Pause/Resume:</label>
        <button onClick={handlePauseToggle}>{isPaused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>  }</button>
      </div>
      <div>
        <label>Show Boundaries:</label>
        <input type="checkbox" checked={showBoundaries} onChange={handleBoundariesToggle} />
      </div>
    </div>
  );
};

Controls.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  onPlaySoundChange: PropTypes.func.isRequired,
  onPauseToggle: PropTypes.func.isRequired,
  onBoundariesToggle: PropTypes.func.isRequired
};

export default Controls;
