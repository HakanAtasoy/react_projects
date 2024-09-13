import { createDeck, dealTableau, shuffle } from "../Deck";

export const initializeGame = (suits) => {
    const deck = createDeck(suits);
    const shuffledDeck = shuffle(deck);

    // Modify dealTableau to accept a deck parameter
    const tableau = dealTableau(shuffledDeck);
    const stock = shuffledDeck.slice(tableau.flatMap(pile => pile.cards).length);

    return {
        stock,
        tableau,
        foundations: Array(8).fill([]),
    };

};

// Handle clicking on the stock and distributing cards
export const handleStockClick = (stock, tableau) => {
    // Check if there are cards in the stock
    if (stock.length === 0) {
        return { stock, tableau }; // No change if stock is empty
    }

    // Calculate how many cards to draw
    const cardsToDraw = Math.min(10, stock.length);

    // Distribute cards to tableau piles
    const newTableau = [...tableau];
    for (let i = 0; i < cardsToDraw; i++) {
        // Calculate the index of the tableau pile to add the card to
        const pileIndex = i % newTableau.length;

        // Draw a card from the stock
        const card = stock.shift(); // Remove the first card from the stock

        // Add the card to the appropriate tableau pile
        newTableau[pileIndex].cards.push({ ...card, isFaceUp: true });
    }

    return {
        stock,
        tableau: newTableau
    };
};


export const isValidMove = (destPileCards, cardsToMove) => {

    // Cards must be in descending order (e.g., King to Ace)
    for (let i = 0; i < cardsToMove.length - 1; i++) {
        const currentCardValue = parseInt(cardsToMove[i].card.slice(0, -1), 10);
        const nextCardValue = parseInt(cardsToMove[i + 1].card.slice(0, -1), 10);
        if (currentCardValue - 1 !== nextCardValue) {
            return false; // Cards are not in descending order
        }
    }

    // If moving to an empty pile, any card can go
    if (destPileCards.length === 0) {
        return true; // Any card can go to an empty pile
    }

    // Check if the top card on the destination pile is one greater than the first card of the moved cards



    const topCardOnDestPile = destPileCards[destPileCards.length - 1];
    const firstCardToMoveValue = parseInt(cardsToMove[0].card.slice(0, -1), 10);
    const topCardValue = parseInt(topCardOnDestPile.card.slice(0, -1), 10);

    return topCardValue === firstCardToMoveValue + 1;
};


// Helper function to check if cards are ordered correctly
export const areCardsOrdered = (cards) => {
    // Implement your own logic to check if the cards are ordered
    // For example, if cards are ordered by a specific rule, e.g., by rank
    for (let i = 0; i < cards.length - 1; i++) {
        if (!isOrdered(cards[i], cards[i + 1])) {
            return false;
        }
    }
    return true;
};

// Helper function to determine if two cards are ordered
export const isOrdered = (card1, card2) => {

    const value1 = parseInt(card1.card.slice(0, -1), 10);
    const value2 = parseInt(card2.card.slice(0, -1), 10);
    const suit1 = card1.card.slice(-1);
    const suit2 = card2.card.slice(-1);


    // Implement your own logic to determine if card1 comes before card2 in the order
    // For example, by comparing ranks or suits
    return value1 == value2 + 1 && suit1 == suit2;
};


export const findFullDescendingSequence = (cards) => {
    // Filter only face-up cards


    // Iterate through all face-up cards to find a valid sequence
    for (let i = 0; i < cards.length; i++) {
        // Check if the current card is a King (value 13)
        if (parseInt(cards[i].card.slice(0, -1), 10) === 13) {
            // Slice the cards starting from the current King
            const sequence = cards.slice(i);

            // Check if the sliced cards form a full descending sequence
            if (isDescendingSequence(sequence)) {
                return i; // Return the starting index of the valid sequence
            }
        }
    }

    return -1; // Return -1 if no valid sequence is found
};

// Helper function to check if a given sequence forms a full descending sequence
const isDescendingSequence = (cards) => {
    if (cards.length < 13) return false; // Not enough cards to form a sequence

    const suit = cards[0].card.slice(-1); // Suit of the starting card
    let expectedValue = 13;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardValue = parseInt(card.card.slice(0, -1), 10);
        const cardSuit = card.card.slice(-1);

        if (cardValue !== expectedValue || cardSuit !== suit) return false;
        expectedValue--;
        if (expectedValue === 0) break; // Found the full sequence
    }

    // Ensure that the sequence has exactly 13 cards
    return expectedValue === 0;
};


// Check if a move is possible from one tableau to another tableau
export const canMoveFromTableauToTableau = (tableau) => {
    for (let i = 0; i < tableau.length; i++) {
        const sourcePile = tableau[i].cards.filter(card => card.isFaceUp);
        if (sourcePile.length === 0) continue;

        for (let j = 0; j < tableau.length; j++) {
            if (i === j) continue;

            const destPile = tableau[j].cards.filter(card => card.isFaceUp);
            const cardsToMove = sourcePile.slice(sourcePile.length - 1);

            if (isValidMove(destPile, cardsToMove) && areCardsOrdered(cardsToMove)) {
                console.log(cardsToMove)
                return true;
            }
        }
    }

    return false;
};