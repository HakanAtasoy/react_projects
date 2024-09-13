import { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { StockArea, FoundationsArea, TableauArea, initializeGame, handleStockClick, isValidMove, areCardsOrdered, findFullDescendingSequence, canMoveFromTableauToTableau, GameOverModal, Timer } from '../../components';
import './GamePage.css';
import { useNavigate } from 'react-router-dom'; // Corrected import


const GamePage = () => {
    const [stock, setStock] = useState([]);
    const [tableau, setTableau] = useState([]);
    const [foundations, setFoundations] = useState([]);
    const [suits, setSuits] = useState(['S']); // Default to one suit
    const [selectedSuit, setSelectedSuit] = useState('1'); // Track the selected suit
    const [gameOver, setGameOver] = useState(false);
    const [gameMessage, setGameMessage] = useState('');
    const [gameStartTime, setGameStartTime] = useState(new Date());
    const navigate = useNavigate(); // Use hook for navigation
    const [points, setPoints] = useState(0);
    const timerRef = useRef(null); // Create a ref for the Timer component
    const [isRunning, setIsRunning] = useState(false);

    const handlePause = () => {
        timerRef.current.pause();
        setIsRunning(false);
    };

    const handleResume = () => {
        timerRef.current.start();
        setIsRunning(true);
    };


    useEffect(() => {
        // Initialize game with suits parameter
        const { stock, tableau, foundations } = initializeGame(suits);
        setTableau(tableau);
        setStock(stock);
        setFoundations(foundations);
        setGameOver(false);
        setGameMessage('');
        setGameStartTime(new Date()); // Set start time
        if (timerRef.current) {
            timerRef.current.reset(); // Reset the timer when game initializes
        }
    }, [suits]);


    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const sourceIndex = parseInt(source.droppableId.split('-')[1], 10);
        const destIndex = parseInt(destination.droppableId.split('-')[1], 10);

        // Handle tableau to tableau moves
        if (source.droppableId.startsWith('pile') && destination.droppableId.startsWith('pile')) {
            if (source.droppableId !== destination.droppableId) {
                const updatedTableau = Array.from(tableau);
                const updatedFoundations = Array.from(foundations);

                // Extract the cards to move
                const sourcePile = updatedTableau[sourceIndex - 1];
                const destPile = updatedTableau[destIndex - 1];
                const cardsToMove = sourcePile.cards.splice(source.index);

                // Check if cards above the chosen card are ordered correctly
                if (!areCardsOrdered(cardsToMove)) {
                    // Cards are not ordered, do not allow the move
                    sourcePile.cards.splice(source.index, 0, ...cardsToMove); // Reinsert cards to original position
                    return;
                }

                // Validate the move
                if (isValidMove(destPile.cards, cardsToMove)) {
                    // Insert the cards into the destination pile
                    destPile.cards.splice(destPile.cards.length, 0, ...cardsToMove);

                    // Update the top card of the source pile to face up if cards are left
                    if (sourcePile.cards.length > 0) {
                        sourcePile.cards[sourcePile.cards.length - 1].isFaceUp = true;
                    }
                    // Update the tableau state
                    setTableau(updatedTableau);
                    
                    
                    // After the move, check for a full sequence in the source pile
                    const faceUpCards = destPile.cards.filter(card => card.isFaceUp);
                    const sequenceStartIndex = faceUpCards.length >= 13 ? findFullDescendingSequence(faceUpCards) : -1;

                    if (sequenceStartIndex > -1) {
                        // Find the first empty foundation
                        const foundationIndex = updatedFoundations.findIndex(foundation => foundation.length === 0);

                        if (foundationIndex !== -1) {
                            // Move only the top card of the sequence to the empty foundation
                            const cardToMove = faceUpCards[sequenceStartIndex]; // Top card of the sequence

                            // Starting point of the moving sequence in the tableau pile
                            const faceDownCount = destPile.cards.findIndex(card => card.isFaceUp) || 0;

                            // Calculate the actual start index for face-up cards
                            const actualStartIndex = faceDownCount + sequenceStartIndex;

                            // Add the card to the foundation
                            updatedFoundations[foundationIndex] = [cardToMove];

                            // Remove the moved sequence from the tableau
                            destPile.cards = [
                                ...destPile.cards.slice(0, actualStartIndex), // Cards before the sequence
                            ];

                            if (destPile.cards.length > 0) {
                                destPile.cards[destPile.cards.length - 1].isFaceUp = true;
                            }

                            setFoundations(updatedFoundations);
                            setTableau(updatedTableau); // Update tableau state after moving

                            if(updatedFoundations.every(foundation => foundation.length == 1)){
                                calculateScore(8);
                                setGameMessage('Congratulations! You won the game!');
                                setGameOver(true);
                            }

                            else {
                                checkGameStatus(); // Check if the game is won or lost
                            }
                               
                        }
                    }

                   
                } else {
                    // Reinsert the cards into the source pile if the move is invalid
                    sourcePile.cards.splice(source.index, 0, ...cardsToMove);
                }

                // Ensure timer is running after a move
                if (timerRef.current) {
                    timerRef.current.resume();
                    setIsRunning(true);
                }
            }
        }
    };

    const onStockClick = () => {
        const { stock: newStock, tableau: newTableau } = handleStockClick(stock, tableau);
        setStock(newStock);
        setTableau(newTableau);
        // Ensure timer is running after drawing from stock
        if (timerRef.current) {
            timerRef.current.resume();
            setIsRunning(true);
        }
        checkGameStatus(); // Check if the game is won or lost
    };


    const handleSuitChange = (newSuits, suit) => {
        setSuits(newSuits);
        setSelectedSuit(suit);
    };


    const checkGameStatus = () => {
        const isWon = foundations.every(foundation => foundation.length == 1); 
        const isLost = !canMoveFromTableauToTableau(tableau) && stock.length == 0;

        if (isWon) {
            calculateScore(8);
            setGameMessage('Congratulations! You won the game!');
            setGameOver(true);
        } else if (isLost) {
            calculateScore(foundations.filter(foundation => foundation.length == 1).length)
            setGameMessage('Sorry, you lost the game. Try again!');
            setGameOver(true);
        }
    };

    const calculateScore = (completeSuitCount) => {

        const endTime = new Date();
        const timeDiff = Math.floor((endTime - gameStartTime) / 1000); // Time in seconds
        const finalScore =  Math.floor(completeSuitCount*1000000 / timeDiff); // Scoring logic
        setPoints(finalScore);
    }

    const restartGame = () => {
        const { stock, tableau, foundations } = initializeGame(suits);
        setTableau(tableau);
        setStock(stock);
        setFoundations(foundations);
        setGameOver(false);
        if (timerRef.current) {
            timerRef.current.reset(); // Reset the timer on restart
        }
    };

    const exitGame = () => {
        // Implement exit logic or redirect
        navigate('/home');
    };


    return (
        <div className="game-container">
            <div className="suit-buttons">
                <button
                    className={selectedSuit === '1' ? 'active' : ''}
                    onClick={() => handleSuitChange(['S'], '1')}
                >
                    One Suit
                </button>
                <button
                    className={selectedSuit === '2' ? 'active' : ''}
                    onClick={() => handleSuitChange(['S', 'H'], '2')}
                >
                    Two Suits
                </button>
                <button
                    className={selectedSuit === '4' ? 'active' : ''}
                    onClick={() => handleSuitChange(['S', 'H', 'D', 'C'], '4')}
                >
                    Four Suits
                </button>
                <div className="timer">
                    <Timer ref={timerRef} initialStartTime={new Date()} />
                    <button onClick={handlePause} disabled={!isRunning} title="Pause">
                        <i className="fas fa-pause"></i>
                    </button>
                    <button onClick={handleResume} disabled={isRunning} title="Resume">
                        <i className="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="stock-and-foundations">
                    <StockArea stock={stock} onStockClick={onStockClick} />
                    <FoundationsArea foundations={foundations} />
                </div>
                <TableauArea tableau={tableau} />
            </DragDropContext>
            <GameOverModal
                isOpen={gameOver}
                message={gameMessage}
                points={points}
                onRestart={restartGame}
                onExit={exitGame}
            />
        </div>
    );

};

export default GamePage;
