import PropTypes from 'prop-types';
import Card from '../Card';
import './FoundationsArea.css';

const FoundationsArea = ({ foundations }) => {


    console.log("foundstions inside foudnations area: ", foundations);
    
    return(
        <div className="foundations-container">
            {foundations.map((foundation, index) => (
                <div
                    key={`foundation-${index}`}
                    className="foundation"
                >
                    {/* Display only the top card if the foundation is not empty */}
                    {foundation.length > 0 && (
                        <Card
                            key={foundation[0].id}
                            card={foundation[0]}
                            isFaceUp={true}
                            dragHandleProps={{}}
                            draggableProps={{}} 
                            innerRef={() => {}}
                            style={{}}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

FoundationsArea.propTypes = {
    foundations: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                card: PropTypes.string.isRequired,
                isFaceUp: PropTypes.bool.isRequired // Ensure this matches your card shape
            })
        )
    ).isRequired
};

export default FoundationsArea;
