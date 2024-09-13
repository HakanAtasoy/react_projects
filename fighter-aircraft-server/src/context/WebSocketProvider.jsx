import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const [planeRotation, setPlaneRotation] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [battery, setBattery] = useState(100);
    const [ws, setWs] = useState(null);


    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5175');
        setWs(socket);

        const handleWebSocketMessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.eventName) {
                case 'PLANE_ANGLE':
                    setPlaneRotation(parsedMessage.data.angle);
                    break;
                case 'PLANE_SPEED':
                    setSpeed(parsedMessage.data.speed);
                    break;
                case 'PLANE_BATTERY':
                    setBattery(parsedMessage.data.battery);
                    break;
                default:
                    break;
            }
        };

        socket.addEventListener('message', handleWebSocketMessage);

        socket.addEventListener('open', () => {
            console.log('WebSocket connection established');
        });
    
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    
        socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
        });

    
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };

    }, []);


    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message); // Send plain string message
        }
    };

    const startBroadcasting = () => {
        console.log("start button pressed.");
        sendMessage('START'); // Send plain string 'START'
    };

    const stopBroadcasting = () => {
        sendMessage('STOP'); // Send plain string 'STOP'
    };

    return (
        <WebSocketContext.Provider value={{ planeRotation, speed, battery, startBroadcasting, stopBroadcasting }}>
            {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { WebSocketProvider };
