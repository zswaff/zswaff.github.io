(() => {
    const defaultColor = '000000';
    const urlParams = new URLSearchParams(location.search);
    let color = urlParams.get('q') || defaultColor;
    if (color.length != 6 || isNaN(parseInt(color, 16))) {
        color = defaultColor;
    }
    const main = document.documentElement.style.backgroundColor = '#' + color;
})();
