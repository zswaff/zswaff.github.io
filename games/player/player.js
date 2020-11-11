const spinner = (() => {
    const urlMatcher = /([^&=]+)=?([^&]*)/g;

    const colors = {
        'background': '#F8F8F8',
        'border': '#AAAAAA',
        'highlight': '#DDDDDD',
        'arrow': '#000000'
    };
    const distEps = .5;

    const speedUrlParamName = 'speed';
    const defaultSpeed = 'fast';
    const speedParams = {
        'fast': {
            'frictionConst': .05,
            'minCycles': 3,
            'maxCycles': 6
        },
        'slow': {
            'frictionConst': .1,
            'minCycles': 12,
            'maxCycles': 15
        }
    };

    const spinner = document.getElementById('spinner');
    const canvas = spinner.getContext('2d');
    const title = document.getElementById('title');
    const action = document.getElementById('action');
    const playerCounter = document.getElementById('player-counter');

    const usedWidth = 40;


    let urlRoot;
    let urlParams;

    let width, height, cx, cy, r, lineLength, tipSize, tipSizeHalf;
    let usedHeight;

    let speed;
    let frictionConst, minCycles, maxCycles;

    let playerCount = 1;

    let spinIntervalId = null;
    let startRotation = Math.random() * 360;
    let currRotation = startRotation;
    let moving = false;


    function parseUrlParams() {
        const url = window.location.search.substring(1);

        urlRoot = null;
        urlParams = {};

        let match;
        while (match = urlMatcher.exec(url)) {
            if (urlRoot === null) {
                urlRoot = match[0];
            }
            let key = decodeURIComponent(match[1]);
            if (key in urlParams) {
                if (!Array.isArray(urlParams[key])) {
                    urlParams[key] = [urlParams[key]];
                }
                urlParams[key].push(decodeURIComponent(match[2]));
            } else {
                urlParams[key] = decodeURIComponent(match[2]);
            }
        }
    }


    function setDefaultUrlParams() {
        let newUrlParams = {};

        speed = urlParams[speedUrlParamName];
        if (!(speed in speedParams)) {
            speed = defaultSpeed;
        }
        newUrlParams[speedUrlParamName] = speed;

        urlParams = newUrlParams;
        let newUrl = window.location.pathname.split('/').pop() + '?'
            + Object.entries(newUrlParams)
                .map(([k,v]) => `${k}=${v}`)
                .join('&');
        history.pushState({}, '', newUrl);
    }


    function updateSpeedParams() {
        frictionConst = speedParams[speed].frictionConst;
        minCycles = speedParams[speed].minCycles;
        maxCycles = speedParams[speed].maxCycles;
    }


    function manageUrlParams() {
        parseUrlParams();
        setDefaultUrlParams();
        updateSpeedParams();
    }
    manageUrlParams();


    function toRadians(valInDegrees) {
        return valInDegrees / 180 * Math.PI;
    }


    function mod(numer, denom) {
        if (numer < 0) {
            return numer - denom * Math.floor(numer / denom);
        }
        return numer % denom;
    }


    function draw() {
        playerCount = parseInt(playerCounter.value);
        const anglePerPlayer = 360 / playerCount;

        canvas.clearRect(0, 0, width, height);

        canvas.beginPath();
        canvas.arc(cx, cy, r - 2, 0, toRadians(360));
        canvas.fillStyle = colors.background;
        canvas.fill();
        canvas.lineWidth = 1;
        canvas.strokeStyle = colors.border;
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
                canvas.strokeStyle = colors.border;
                canvas.stroke();
            }

            if (!moving) {
                const cPlayer = Math.floor(mod(currRotation - 90 + (anglePerPlayer / 2), 360) / anglePerPlayer);
                const startAngle = (90 + (anglePerPlayer * (cPlayer - .5))) % 360;
                const endAngle = (startAngle + anglePerPlayer) % 360;
                canvas.beginPath();
                canvas.arc(cx, cy, r - 2, toRadians(startAngle), toRadians(endAngle));
                canvas.lineTo(cx, cy);
                canvas.fillStyle = colors.highlight;
                canvas.fill();
            }
        }

        canvas.beginPath();
        canvas.arc(cx, cy, 10, 0, toRadians(360));
        canvas.fillStyle = colors.arrow;
        canvas.fill();

        canvas.beginPath();
        canvas.moveTo(cx, cy);
        const xScale = Math.cos(toRadians(currRotation));
        const yScale = Math.sin(toRadians(currRotation));
        const lx = cx + lineLength * xScale;
        const ly = cy + lineLength * yScale;
        canvas.lineTo(lx, ly);
        canvas.lineWidth = 7;
        canvas.strokeStyle = colors.arrow;
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
        canvas.fillStyle = colors.arrow;
        canvas.fill();
    }


    function resizeWindow() {
        usedHeight = Math.max(title.offsetHeight, action.offsetHeight) * 2;
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


    function spin() {
        /*
        a = - c_1 * v - c_2 * a
        => v(t) = v_i - d_1 * e^(-t / d_2)
        => p(t) = p_f * (1 - e^(-t / (p_f * k)))
        where k is a frictional constant
        */

        const finalDeltaRotation = 360 * (Math.random() * (maxCycles - minCycles) + minCycles);
        const expDenom = finalDeltaRotation * frictionConst;

        moving = true;
        startRotation = currRotation;
        let t = 0;

        function step() {
            t++;
            const deltaRotation = finalDeltaRotation * (1 - Math.exp(-t / expDenom));
            if (finalDeltaRotation - deltaRotation > distEps) {
                currRotation = mod(startRotation + deltaRotation + distEps, 360);
            }
            else {
                currRotation = mod(startRotation + finalDeltaRotation, 360);
                clearInterval(spinIntervalId);
                spinIntervalId = null;
                moving = false;
            }
            draw();
        }

        if (spinIntervalId) {
            clearInterval(spinIntervalId);
        }
        spinIntervalId = setInterval(step, 5);
    }
    return {'draw': draw, 'spin': spin};
})();