import { Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Card from '../Card';
import './StockArea.css'

const StockArea = ({ stock, onStockClick  }) => (
    <Droppable droppableId="stock" direction="vertical">
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="stock"
                onClick={onStockClick}
            >
                {stock.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                            <Card
                                card={card}
                                isFaceUp={false}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                innerRef={provided.innerRef}
                                style={provided.draggableProps.style}
                            />
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);


StockArea.propTypes = {
    stock: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            card: PropTypes.string.isRequired
        })
    ).isRequired,
    onStockClick: PropTypes.func.isRequired  // Add prop type for onStockClick
};


export default StockArea;
