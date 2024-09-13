import { motion } from 'framer-motion';
import { useContext, useState, useEffect } from 'react';
import { WebSocketContext } from '../../context';
import { useThrottle } from 'use-throttle'; 



const PlaneSvg = () => {


    const { planeRotation } = useContext(WebSocketContext);
    const [initialRotation, setInitialRotation] = useState(0);

    // Set the initial rotation when the component mounts
    useEffect(() => {
        setInitialRotation(0); //-45 makes the plane face the top side
    }, []);

    const throttledRotation = useThrottle(Number(planeRotation) || initialRotation, 50);

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            style={{fill:'white', transformOrigin: 'center center'}}
            animate={{ rotate: throttledRotation  }}
            transition={{ duration: 0.005, ease: 'easeInOut' }}
        >
            <motion.path
                d="m10.92 74.938 15.388-16.185c9.01-9.011 24.185-5.885 24.185-5.885l45.03 6.161 22.805-22.316c12.016-11.8 22.867 6.254 18.147 12.476l-11.71 13.61 48.494 8.982 16.46-19.19c17.594-21.026 30.684-2.083 22.746 9.074l-10.637 13.457 72.863 9.502c62.65-60.29 88.227-85.299 104.711-70.44 16.59 14.952-12.756 44.758-69.828 103.546l10.36 75.07 15.266-12.721c9.011-7.51 25.012 4.538 8.49 20.2l-20.996 19.802 8.858 49.137 13.12-10.085c11.586-9.226 25.655 2.975 9.993 19.71l-20.844 20.998c-.859.643 6.805 43.098 6.805 43.098 4.72 20.812-7.02 28.416-7.02 28.416l-14.315 12.476-54.379-153.604c-4.505-13.517-15.925-28.196-35.006-26.453-10.084 1.072-35.558 18.27-38.99 22.346l-58.978 56.708c-1.501 1.073 9.074 73.721 9.074 73.721 0 2.146-18.699 26.668-18.699 26.668L84.947 316.7l-18.453 8.583 10.79-16.798L10 270.505l25.228-18.453c12.015 2.79 75.008 9.87 76.295 9.227 0 0 51.297-50.873 54.226-53.95 16.95-17.808 22.653-24.462 25.228-33.258 2.576-8.804-1.813-21.706-28.416-38.041C125.872 113.5 10.92 74.938 10.92 74.938z"
                className="plane-svg"
            />
        </motion.svg>
    );

}
export default PlaneSvg;
