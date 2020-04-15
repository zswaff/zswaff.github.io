const randomize = (() => {
    const cardElements = {
        'Communications': [
            document.getElementById('communications')
        ],
        'Finance': [
            document.getElementById('finance')
        ],
        'Force': [
            document.getElementById('force')
        ],
        'Special Interest': [
            document.getElementById('special-interest-0'),
            document.getElementById('special-interest-1')
        ]
    };

    function randomize() {
        Object.keys(cardElements).forEach(key => {
            const elements = cardElements[key];
            const potCards = allCards[key];
            const chosenCards = selectWithoutReplacement(potCards, elements.length);
            elements.forEach((element, i) =>
                element.innerHTML = chosenCards[i]
            );
        });
    }
    randomize();
    return randomize;
})();
