const spinner = (() => {
    const maxPlayers = 30;
    const a = .00005;

    const spinner = document.getElementById('spinner');
    const canvas = spinner.getContext('2d');
    let width, height, cx, cy, r, lineLength, tipSize, tipSizeHalf;

    const usedWidth = 50;
    const title = document.getElementById('title');
    const action = document.getElementById('action');
    const usedHeight = Math.max(title.offsetHeight, action.offsetHeight) * 2;

    const playerCounter = document.getElementById('player-counter');
    let playerCount = 1;

    let spinIntervalId = null;
    let startRotation = Math.random() * 360;
    let currRotation = startRotation;


    function toRadians(valInDegrees) {
        return valInDegrees / 180 * Math.PI;
    }


    function mod(numer, denom) {
        if (numer < 0) {
            return numer - denom * Math.floor(numer / denom);
        }
        return numer % denom;
    }


    function getPlayerCount() {
        const strVal = playerCounter.value;
        if (!strVal) {
            return 1;
        }
        const intVal = parseInt(strVal);
        if (isNaN(intVal) || intVal < 1) {
            return 1;
        }
        if (intVal > maxPlayers) {
            return maxPlayers;
        }
        return intVal;
    }


    function validate() {
        playerCounter.value = getPlayerCount();
    }


    function draw() {
        playerCount = getPlayerCount();
        const anglePerPlayer = 360 / playerCount;

        canvas.clearRect(0, 0, width, height);

        canvas.beginPath();
        canvas.arc(cx, cy, r - 2, 0, toRadians(360));
        canvas.fillStyle = '#F8F8F8';
        canvas.fill();
        canvas.lineWidth = 1;
        canvas.strokeStyle = '#AAAAAA';
        canvas.stroke();

        if (playerCount > 1) {
            for (let i = 0; i < playerCount; i++) {
                canvas.beginPath();
                canvas.moveTo(cx, cy);
                const angle = toRadians((90 + (anglePerPlayer * (i - .5))) % 360);
                const rx = cx + ((r - 2) * Math.cos(angle));
                const ry = cy + ((r - 2) * Math.sin(angle));
                canvas.lineTo(rx, ry);
                canvas.lineWidth = 1;
                canvas.strokeStyle = '#AAAAAA';
                canvas.stroke();
            }

            const cPlayer = Math.floor(mod(currRotation - 90 + (anglePerPlayer / 2), 360) / anglePerPlayer);
            const startAngle = (90 + (anglePerPlayer * (cPlayer - .5))) % 360;
            const endAngle = (startAngle + anglePerPlayer) % 360;
            canvas.beginPath();
            canvas.arc(cx, cy, r - 2, toRadians(startAngle), toRadians(endAngle));
            canvas.lineTo(cx, cy);
            canvas.fillStyle = '#DDDDDD';
            canvas.fill();
        }

        canvas.beginPath();
        canvas.arc(cx, cy, 10, 0, toRadians(360));
        canvas.fillStyle = '#000000';
        canvas.fill();

        canvas.beginPath();
        canvas.moveTo(cx, cy);
        const xScale = Math.cos(toRadians(currRotation));
        const yScale = Math.sin(toRadians(currRotation));
        const lx = cx + lineLength * xScale;
        const ly = cy + lineLength * yScale;
        canvas.lineTo(lx, ly);
        canvas.lineWidth = 7;
        canvas.strokeStyle = '#000000';
        canvas.stroke();

        canvas.beginPath();
        const tx = lx + tipSize * xScale;
        const ty = ly + tipSize * yScale;
        canvas.moveTo(tx, ty);
        const c1x = lx - tipSizeHalf * yScale;
        const c1y = ly + tipSizeHalf * xScale;
        canvas.lineTo(c1x,c1y);
        const c2x = lx + tipSizeHalf * yScale;
        const c2y = ly - tipSizeHalf * xScale;
        canvas.lineTo(c2x,c2y);
        canvas.fillStyle = '#000000';
        canvas.fill();
    }


    function resizeWindow() {
        width = window.innerWidth - usedWidth;
        height = window.innerHeight - usedHeight;
        canvas.canvas.width = width;
        canvas.canvas.height = height;
        cx = width / 2;
        cy = height / 2;
        r = Math.min(cx, cy);
        lineLength = r * (4 / 5);
        tipSize = r * (2 / 15);
        tipSizeHalf = tipSize / 2;

        draw();
    }
    resizeWindow();
    window.addEventListener('resize', resizeWindow);


    function increment(amount) {
        playerCounter.value = getPlayerCount() + amount;
        validate();
        draw();
    }


    function spin() {
        const goalDelta = Math.random() * 720 + 1080;
        const b = - ((24 * (a ** 2) * goalDelta) ** (1/3));
        const c = (b ** 2) / (4 * a);
        const tFinal = Math.floor(- (b / (2 * a))) + 1; 

        startRotation = currRotation;
        let t = 0;

        if (spinIntervalId) {
            clearInterval(spinIntervalId);
        }
        spinIntervalId = setInterval(step, 5);

        function step() {
            t++;
            if (t <= tFinal) {
                if (t < tFinal) {
                    const deltaRotation = ((1/3) * a * (t ** 3)) + ((1/2) * b * (t ** 2)) + (c * t);
                    currRotation = mod(startRotation + deltaRotation, 360);
                }
                else {
                    currRotation = mod(startRotation + goalDelta, 360);
                }
                draw();
            }
            else {
                clearInterval(spinIntervalId);
            }
        }
    }
    return {'validate': validate, 'draw': draw, 'increment': increment, 'spin': spin};
})();