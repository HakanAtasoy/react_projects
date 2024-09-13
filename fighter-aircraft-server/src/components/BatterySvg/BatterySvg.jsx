import { motion } from "framer-motion";
import { useContext } from "react";
import { WebSocketContext } from "../../context";


const BatterySvg = (props) => {

    const { battery } = useContext(WebSocketContext);

    // Battery percentage for each rectangle
    const percentagePerRect = 25;

    // Calculate full and partial fills
    const fullRects = Math.floor(battery / percentagePerRect);
    const partialFill = battery % percentagePerRect;


    // Determine color based on battery percentage
    const getColor = (battery) => {
        if (battery <= 25) return 'red';
        if (battery <= 50) return 'yellow';
        return 'green';
    };

    // Define blinking animation
    const blinkingAnimation = {
        animate: { opacity: [1, 0, 1] },
        transition: { duration: 1, repeat: Infinity }
    };

    // Determine if blinking animation should be applied
    const shouldBlink = battery < 20;


    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            className="battery-svg"
            viewBox="0 0 471.829 471.829"
            {...props}
            {...(shouldBlink ? blinkingAnimation : {opacity: 1})}
        >

            <text
                x="50%"
                y="100"
                textAnchor="middle"
                fontSize="48"
                fill="white"
                fontFamily="Arial, sans-serif"
            >
                {battery}%
            </text>


            {[0, 1, 2, 3].map(index => {
                const isFull = index > (3 - fullRects);
                const isPartial = index == (3 - fullRects)
                const color = getColor(battery)
                let height = 0;
                let y;

                if (isFull) {
                    height = 90;
                    y = 60 + index * 96;
                }

                if (isPartial) {
                    height = (partialFill / percentagePerRect) * 90;
                    y = 60 + 90 - height + index * 96;
                }


                return (
                    <motion.rect
                        key={index}
                        x="146"
                        y={y}
                        width="180"
                        height={height}
                        fill={color}
                    />
                );
            })}

            <motion.path d="M319.089 27.221h-36.475V0h-95.27v27.221h-34.607c-22.517 0-40.829 18.317-40.829 40.832v362.946c0 22.51 18.317 40.83 40.829 40.83h166.352c22.524 0 40.832-18.32 40.832-40.83V68.052c0-22.514-18.308-40.831-40.832-40.831zm13.616 403.781c0 7.501-6.108 13.607-13.616 13.607H152.737c-7.501 0-13.608-6.095-13.608-13.607V68.052c0-7.501 6.107-13.611 13.608-13.611h166.352c7.508 0 13.616 6.109 13.616 13.611" />
        </motion.svg>
    );

}
export default BatterySvg;
