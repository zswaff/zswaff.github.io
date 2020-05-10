const dominion = (() => {
    const setAmounts = {
        'Base': 10
    };


    const leftSidebar = document.getElementById('left-sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    const images = document.getElementById('images');
    const submitButton = document.getElementById('action-button');


    function getTotalCards() {
        return Object.values(setAmounts).reduce((a,b) => a + b, 0);
    }


    Object.keys(allCards).forEach(function(set) {
        if (!(set in setAmounts)) {
            setAmounts[set] = 0;
        }
        const amount = setAmounts[set];
        const container = document.createElement('div');
        container.setAttribute('class', 'set-picker-container');
        const title = document.createElement('h2');
        title.setAttribute('class', 'set-picker-title');
        title.appendChild(document.createTextNode(set));
        container.appendChild(title);
        const picker = document.createElement('select');
        picker.setAttribute('class', 'set-picker-counter');
        picker.setAttribute('data-set', set);
        picker.setAttribute('onchange', 'dominion.updateSetCount(this);');
        for (let i = 0; i <= 10; i++){
            const option = document.createElement('option');
            option.text = i;
            option.value = i;
            if (i == amount) {
                option.setAttribute('selected', '');
            }
            picker.appendChild(option)
        }
        container.appendChild(picker);

        leftSidebar.appendChild(container);
    });
    const container = document.createElement('div');
    container.setAttribute('class', 'set-picker-container');
    const title = document.createElement('h2');
    title.setAttribute('class', 'set-picker-title');
    title.appendChild(document.createTextNode('Total'));
    container.appendChild(title);
    const totalBox = document.createElement('h2');
    totalBox.setAttribute('id', 'total');
    totalBox.setAttribute('class', 'set-picker-counter');
    totalBox.appendChild(document.createTextNode(getTotalCards()));
    container.appendChild(totalBox);
    leftSidebar.appendChild(container);


    function updateSetCount(elem) {
        setAmounts[elem.dataset.set] = parseInt(elem.value);
        const cardTotal = getTotalCards();
        totalBox.innerHTML = cardTotal;
        submitButton.disabled = cardTotal !== 10;
    }


    function randomize() {
        rightSidebar.innerHTML = '';
        images.innerHTML = '';

        Object.keys(setAmounts).forEach(function(set) {
            const amount = setAmounts[set];
            if (amount == 0) {
                return;
            }

            const title = document.createElement('h2');
            title.setAttribute('class', 'set-title');
            title.appendChild(document.createTextNode(set));
            rightSidebar.appendChild(title);

            const setCards = allCards[set].cards;
            const chosenCards = selectWithoutReplacement(setCards, amount);
            chosenCards.sort((a, b) => a.name.localeCompare(b.name));

            const list = document.createElement('ul');
            list.setAttribute('class', 'set-item-list');
            chosenCards.forEach(function(card) {
                const item = document.createElement('li');
                item.setAttribute('class', 'set-item');
                item.appendChild(document.createTextNode(card.name));
                list.appendChild(item);

                const image = document.createElement('img');
                image.setAttribute('class', 'img-card');
                image.setAttribute('src', card.imgLink);
                image.setAttribute('alt', card.name);
                images.appendChild(image);
            });
            rightSidebar.appendChild(list);
        });
    }
    randomize();
    return {'randomize': randomize, 'updateSetCount': updateSetCount};
})();
