const randomize = (() => {
    const setAmounts = {
        'Base': 5,
        'Empires': 5
    };

    const cardElements = {};

    function randomize()
        let chosenCards = [];
        Object.keys(setAmounts).forEach(function(set) {
            const amount = setAmounts[set];
            const setCards = allCards[set].cards;
            chosenCards.push(...selectWithoutReplacement(setCards, amount));
        });
        console.log(chosenCards);
    }
    randomize();
    return randomize;
})();
