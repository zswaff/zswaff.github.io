(() => {
    const params = new URLSearchParams(location.search);
    const color = params.get('q');
    if (color === null || color.length != 6 || isNaN(parseInt(color, 16))) {
        location.search = '?q=' + Math.floor(Math.random() * parseInt('1000000', 16)).toString(16).padStart(6, '0');
    }
    if (Array.from(params).length > 1) {
        location.search = '?q=' + color;
    }
    document.documentElement.style.backgroundColor = '#' + color;
})();
