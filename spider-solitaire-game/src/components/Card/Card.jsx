import './Card.css';
import PropTypes from 'prop-types';

const Card = ({ card, isFaceUp, draggableProps, dragHandleProps, innerRef, style, className  }) => {

    const getCardImage = (card) => {
        const suitMap = {
            H: 'hearts',
            D: 'diamonds',
            C: 'clubs',
            S: 'spades'
        };

        if (isFaceUp) {
            const rank = card.card.slice(0, -1); // Extract rank
            const suit = card.card.slice(-1); // Extract suit
            const suitDir = suitMap[suit]; // Get directory name for suit
            return `/card-icons/${suitDir}/${rank}.png`; // Construct path
        }

        return '/card-icons/card-backgrounds/classic_blue.png'; // Back-side for face-down cards
    };

    return (
        <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            style={{ ...style, ...draggableProps.style }}
            className={`card ${className}`} // Apply className prop
        >
            <img src={getCardImage(card)} alt={card.card} />
        </div>
    );
};


// Define prop types for the Card component
Card.propTypes = {
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        card: PropTypes.string.isRequired
    }).isRequired,
    isFaceUp: PropTypes.bool.isRequired,
    draggableProps: PropTypes.object.isRequired,
    dragHandleProps: PropTypes.object,
    innerRef: PropTypes.func.isRequired,
    style: PropTypes.object,
    className: PropTypes.string // Add className to prop types
};

Card.defaultProps = {
    dragHandleProps: {},
    style: {},
    className: '' // Default to an empty string
};

export default Card;
