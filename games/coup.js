const randomize = (() => {
    const allCards = {
        'Communications': [
            'Director',
            'Newscaster',
            'Producer',
            'Reporter',
            'Writer'
        ],
        'Finance': [
            'Banker',
            'Capitalist',
            'Farmer',
            'Financier',
            'Plantation Owner',
            'Speculator',
            'Spy'
        ],
        'Force': [
            'Anarchist',
            'Crime Boss',
            'General',
            'Guerrilla',
            'Judge',
            'Mercenary',
            'Paramilitary'
        ],
        'Special Interest': [
            'Arms Dealer',
            'Communist',
            'Customs Officer',
            'Foreign Consular',
            'Intellectual',
            'Lawyer',
            'Missionary',
            'Peacekeeper',
            'Politician',
            'Priest',
            'Protestor',
            'Socialist'
        ]
    };

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
