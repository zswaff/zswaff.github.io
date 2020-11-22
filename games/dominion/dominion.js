const dominion = (() => {
    const setAmounts = {
        'Base': 10
    };


    const leftSidebar = document.getElementById('left-sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    const content = document.getElementById('content');
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

        const setLink = document.createElement('a');
        setLink.setAttribute('href', allCards[set].link);
        setLink.setAttribute('target', '_blank');
        const title = document.createElement('h2');
        title.setAttribute('class', 'set-picker-title');
        title.innerHTML = set;
        setLink.appendChild(title);
        container.appendChild(setLink);

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
            picker.appendChild(option);
        }
        container.appendChild(picker);

        leftSidebar.appendChild(container);
    });
    const container = document.createElement('div');
    container.setAttribute('class', 'set-picker-container');
    const title = document.createElement('h2');
    title.setAttribute('id', 'total-title');
    title.innerHTML = 'Total';
    container.appendChild(title);
    const totalBox = document.createElement('h2');
    totalBox.setAttribute('id', 'total-count');
    totalBox.innerHTML = getTotalCards();
    container.appendChild(totalBox);
    leftSidebar.appendChild(container);


    function updateSetCount(elem) {
        setAmounts[elem.dataset.set] = parseInt(elem.value);
        const cardTotal = getTotalCards();
        const okCount = cardTotal === 10;
        totalBox.innerHTML = cardTotal;
        totalBox.style.color = okCount ? 'black' : 'red';
        submitButton.disabled = !okCount;
    }


    function randomize() {
        rightSidebar.innerHTML = '';
        content.innerHTML = '';

        let listCounter = 1;
        Object.keys(setAmounts).forEach(function(set) {
            const amount = setAmounts[set];
            if (amount == 0) {
                return;
            }

            const title = document.createElement('h2');
            title.setAttribute('class', 'set-title');
            title.innerHTML = set;
            rightSidebar.appendChild(title);

            const setCards = allCards[set].cards;
            const chosenCards = selectWithoutReplacement(setCards, amount);
            chosenCards.sort((a, b) => a.name.localeCompare(b.name));

            const list = document.createElement('ol');
            list.setAttribute('class', 'set-item-list');
            list.setAttribute('start', listCounter);
            chosenCards.forEach(function(card) {
                listCounter++;

                const item = document.createElement('li');
                item.setAttribute('class', 'set-item');
                const itemLink = document.createElement('a');
                itemLink.setAttribute('href', card.link);
                itemLink.setAttribute('target', '_blank');
                itemLink.innerHTML = card.name;
                item.appendChild(itemLink);
                list.appendChild(item);

                const imgLink = document.createElement('a');
                imgLink.setAttribute('href', card.link);
                imgLink.setAttribute('target', '_blank');
                const img = document.createElement('img');
                img.setAttribute('class', 'img-card');
                img.setAttribute('src', card.imgLink);
                img.setAttribute('alt', card.name);
                imgLink.appendChild(img);
                content.appendChild(imgLink);
            });
            rightSidebar.appendChild(list);
        });
    }
    randomize();
    return {'randomize': randomize, 'updateSetCount': updateSetCount};
})();
