import { Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Card from '../Card';
import './TableauArea.css'
import { areCardsOrdered } from '../GameLogic';



const TableauArea = ({ tableau }) => {

    // Determine if a card should be draggable
    const isCardDraggable = (pile, cardIndex) => {
        const cardsAbove = pile.cards.slice(cardIndex);
        return areCardsOrdered(cardsAbove);
    };


    return(
        <div className="tableau-container">
            {tableau.map((pile) => (
                <Droppable key={pile.id} droppableId={pile.id} direction="vertical" >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="tableau-pile"
                        >
                            {pile.cards.map((card, cardIndex) => (
                                card.isFaceUp ? (
                                    isCardDraggable(pile, cardIndex) ? (
                                    <Draggable 
                                        key={card.id} 
                                        draggableId={card.id} 
                                        index={cardIndex}
                                    >
                                        {(provided, snapshot) => (
                                            <Card
                                                card={card}
                                                isFaceUp={true}
                                                draggableProps={provided.draggableProps}
                                                dragHandleProps={provided.dragHandleProps}
                                                innerRef={provided.innerRef}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    zIndex: snapshot.isDragging ? 1000 : cardIndex,
                                                    '--index': cardIndex,
                                                }}

                                            />
                                        )}
                                    </Draggable>
                                    ): (
                                        <Card 
                                        key={card.id}
                                        card={card}
                                        isFaceUp={true}
                                        draggableProps={{}} // No drag and drop for cards on top of unordered sequences
                                        dragHandleProps={{}}
                                        innerRef={() => {}}
                                        style={{
                                            zIndex: cardIndex,
                                            '--index': cardIndex,
                                        }}
                                        className="face-down"
                                    />

                                    )
                                ) : (
                                    <Card 
                                        key={card.id}
                                        card={card}
                                        isFaceUp={false}
                                        draggableProps={{}} // No drag and drop for face-down cards
                                        dragHandleProps={{}}
                                        innerRef={() => {}}
                                        style={{
                                            zIndex: cardIndex,
                                            '--index': cardIndex,
                                        }}
                                        className="face-down"
                                    />
                                )
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            ))}
        </div>

    );
};


TableauArea.propTypes = {
    tableau: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            cards: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    card: PropTypes.string.isRequired,
                    isFaceUp: PropTypes.bool.isRequired
                })
            ).isRequired
        })
    ).isRequired
};


export default TableauArea;
