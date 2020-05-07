const randomize = (() => {
    const setAmounts = {
        'Base': 10
    };


    const sidebar = document.getElementById('sidebar');
    const text = document.getElementById('text');
    const images = document.getElementById('images');

    Object.keys(allCards).forEach(function(set) {
        const container = document.createElement('div');
        container.setAttribute('class', 'foof');
        const title = document.createElement('h2');
        title.setAttribute('class', 'set-picker-title');
        title.appendChild(document.createTextNode(set));
        container.appendChild(title);
        const picker = document.createElement('select');
        picker.setAttribute('class', 'set-picker-counter');
        for (let i = 1; i <= 10; i++){
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            picker.appendChild(option)
        }
        container.appendChild(picker);
        sidebar.appendChild(container);
    });


    function randomize() {
        text.innerHTML = '';
        images.innerHTML = '';

        Object.keys(setAmounts).forEach(function(set) {
            const title = document.createElement('h2');
            title.setAttribute('class', 'foof');
            title.appendChild(document.createTextNode(set));
            text.appendChild(title);

            const amount = setAmounts[set];
            const setCards = allCards[set].cards;
            const chosenCards = selectWithoutReplacement(setCards, amount);
            chosenCards.sort((a, b) => a.name.localeCompare(b.name));

            const list = document.createElement('ul');
            list.setAttribute('class', 'foof');
            chosenCards.forEach(function(card) {
                const item = document.createElement('li');
                item.setAttribute('class', 'foof');
                item.appendChild(document.createTextNode(card.name));
                text.appendChild(item);

                const image = document.createElement('img');
                image.setAttribute('class', 'img-card');
                image.setAttribute('src', card.imgLink);
                image.setAttribute('alt', card.name);
                images.appendChild(image);
            });
            text.appendChild(list);
        });
    }
    randomize();
    return randomize;
})();
