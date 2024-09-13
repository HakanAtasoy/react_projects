import './App.css'
import { BatterySvg, PlaneSvg, SpeedometerArrowSvg, SpeedometerCircleSvg } from './components'
import { WebSocketContext } from './context'
import { useContext } from 'react';

function App() {

    const { startBroadcasting, stopBroadcasting } = useContext(WebSocketContext);


    return (
        <div className="container">
            <div className="plane-container">
                <PlaneSvg className="plane-svg svg" />
            </div>
            <div className="speedometer-container">
                <SpeedometerCircleSvg className="speedometer-circle-svg svg" />
                <SpeedometerArrowSvg className="speedometer-arrow-svg svg" />
            </div>
            <div className="battery-container">
                <BatterySvg className="battery-svg svg" />
            </div>
            <div className="buttons" >
                <button onClick={startBroadcasting}>Start Getting Messages</button>
                <button onClick={stopBroadcasting} style={{ marginLeft: '10px' }}>Stop Getting Messages</button>
            </div>
        </div>
    )
}

export default App
