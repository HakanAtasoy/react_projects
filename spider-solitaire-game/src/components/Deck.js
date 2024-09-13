export const createDeck = (suits) => {
    // Define card ranks
    const ranks = ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
    let baseDeck = [];
    let id = 0;

    // Create a base deck based on provided suits
    for (let suit of suits) {
        for (let rank of ranks) {
            baseDeck.push({
                card: `${rank}${suit}` // No ID in the base deck
            });
        }
    }

    // Determine how many decks to create based on the number of suits
    let numDecks;
    switch (suits.length) {
        case 1: // Single suit
            numDecks = 8;
            break;
        case 2: // Two suits
            numDecks = 4;
            break;
        case 4: // Four suits
            numDecks = 2;
            break;
        default:
            throw new Error('Invalid number of suits');
    }

    // Generate the full deck by duplicating the base deck the required number of times
    const fullDeck = [];
    for (let i = 0; i < numDecks; i++) {
        fullDeck.push(...baseDeck.map(card => ({
            ...card,
            id: `${id++}-${card.card}` // Assign unique ID for each card in the final deck
        })));
    }

    return fullDeck;
};


export const dealTableau = (deck) => {
    const tableau = [];
    let cardIndex = 0;

    // Create 10 piles: first 4 piles get 6 cards each, next 6 piles get 5 cards each
    for (let i = 0; i < 10; i++) {
        // Determine number of cards for this pile
        const numCards = i < 4 ? 6 : 5;

        // Slice the deck for the current pile
        const cards = deck.slice(cardIndex, cardIndex + numCards);
        cardIndex += numCards;

        // Only the top card of each pile is face-up
        tableau.push({
            id: `pile-${i + 1}`,
            cards: cards.map((card, index) => ({
                ...card,
                isFaceUp: index === numCards - 1 // Only the top card is face-up
            }))
        });
    }

    return tableau;
};



export const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle…
    while (currentIndex !== 0) {
        // Pick a remaining element…
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return knuthShuffle(array);
};

export const knuthShuffle = (array) => {
    const shuffledArray = array.slice(); // Copy the array to avoid modifying the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

