import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { Howl } from 'howler';

const BouncingBall = ({ color, speed, playSound, isPaused }) => {
    const ballRef = useRef();
    const [velocity] = useState(new THREE.Vector3(0.1, 0, 0));


    // Load sound
    const bounceSound = new Howl({
        src: ['/sounds/tick_sound.wav'],
        volume: 1.0
    });



    useFrame(() => {

        if (isPaused) return; // Do nothing if paused

        const ball = ballRef.current;

        if (ball) {
            ball.position.x += velocity.x * speed;

            // Bounce off the edges
            if (ball.position.x > 5 || ball.position.x < -5) {
                velocity.x *= -1;
                if (playSound) bounceSound.play();
            }

        }
    });

    return (
        <mesh ref={ballRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

BouncingBall.propTypes = {
    color: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    playSound: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
};

const Boundary = ({ position, size }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshPhongMaterial 
            color="black" 
            specular="white" 
            shininess={100} 
        />
    </mesh>
);

Boundary.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    size: PropTypes.arrayOf(PropTypes.number).isRequired,
};


const BouncingBallScene = ({ color, speed, playSound, isPaused, showBoundaries }) => (
    <Canvas>
        {/* Adjust the camera */}
        <perspectiveCamera
            makeDefault
            position={[0, 0, 10]}
            fov={75}
            near={0.1}
            far={1000}
        />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <BouncingBall color={color} speed={speed} playSound={playSound} isPaused={isPaused} />
        {showBoundaries && (
            <>
                <Boundary position={[-8, 0, 0]} size={[1, 8, 1]} />
                <Boundary position={[8, 0, 0]} size={[1, 8, 1]} />
            </>
        )}
    </Canvas>
);


BouncingBallScene.propTypes = {
    color: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    playSound: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
    showBoundaries: PropTypes.bool.isRequired

};

export default BouncingBallScene;
