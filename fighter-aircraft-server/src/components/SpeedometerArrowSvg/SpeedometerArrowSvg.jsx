import { motion } from 'framer-motion';
import { useContext } from 'react';
import { WebSocketContext } from '../../context';
import { useThrottle } from 'use-throttle'; // Install `use-throttle` package

const SpeedometerArrowSvg = (props) => {

    const { speed } = useContext(WebSocketContext);
    // Use throttle to limit updates
    const throttledSpeed = useThrottle(speed, 50); // Throttle updates 

    // Calculate arrow rotation
    const arrowRotation =  (210 + throttledSpeed * 3) % 360;


    return(
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="speedometer-arrow-svg"
            viewBox="0 0 100 100"
            {...props}
            animate={{ rotate: arrowRotation }}
            transition={{ duration: 0.005, ease: "easeInOut"  }}
        >
            <motion.path
                d="m50 5-7 85h14z"
                // Optional: Define path animations
            />
            <motion.circle
                cx={50}
                cy={93}
                r={12}
                // Optional: Define circle animations
            />
        </motion.svg>
    );
};

export default SpeedometerArrowSvg;

