import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const Timer = forwardRef(({ initialStartTime }, ref) => {
    const [startTime, setStartTime] = useState(initialStartTime);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // Changed initial state to false

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((new Date() - startTime) / 1000));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [startTime, isRunning]);

    useImperativeHandle(ref, () => ({
        start: () => {
            setStartTime(new Date() - elapsedTime * 1000); // Adjust start time based on elapsed time
            setIsRunning(true);
        },
        pause: () => setIsRunning(false),
        resume: () => {
            setStartTime(new Date() - elapsedTime * 1000); // Adjust start time based on elapsed time
            setIsRunning(true);
        },
        reset: () => {
            setElapsedTime(0);
            setStartTime(new Date());
            setIsRunning(false);
        }
    }));

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    return (
        <div>
            <div>
                Time: {hours > 0 ? `${hours}h ` : ''}{minutes}m {seconds}s
            </div>
        </div>
    );
});

Timer.propTypes = {
    initialStartTime: PropTypes.instanceOf(Date).isRequired
};

Timer.displayName = 'Timer';


export default Timer;
