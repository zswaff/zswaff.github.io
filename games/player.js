const spin = (() => {
    const a = .00005;
    const lineLength = 240;
    const tipLenth = 40;
    const tipWidth = 40;
    const tipHalfWidth = tipWidth / 2;

    const spinner = document.getElementById('spinner')
    const canvas = spinner.getContext('2d');
    const width = spinner.width;
    const height = spinner.height;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy);

    let spinIntervalId;
    let startRotation = Math.random() * 360;
    let currRotation = startRotation;


    function toRadians(valInDegrees) {
        return valInDegrees / 180 * Math.PI;
    }


    function draw() {
        canvas.clearRect(0, 0, width, height);

        canvas.beginPath();
        canvas.arc(cx, cy, r - 2, 0, toRadians(360));
        canvas.fillStyle = '#F8F8F8';
        canvas.fill();
        canvas.lineWidth = 2;
        canvas.strokeStyle = '#DDDDDD';
        canvas.stroke();

        canvas.beginPath();
        canvas.arc(cx, cy, 10, 0, toRadians(360));
        canvas.fillStyle = '#000000';
        canvas.fill();

        canvas.beginPath();
        canvas.moveTo(cx, cy);
        const xScale = - Math.sin(toRadians(currRotation));
        const yScale = Math.cos(toRadians(currRotation));
        const lx = cx + lineLength * xScale;
        const ly = cy + lineLength * yScale;
        canvas.lineTo(lx, ly);
        canvas.lineWidth = 7;
        canvas.strokeStyle = '#000000';
        canvas.stroke();

        canvas.beginPath();
        const tx = lx + tipLenth * xScale;
        const ty = ly + tipLenth * yScale;
        canvas.moveTo(tx, ty);
        const c1x = lx - tipHalfWidth * yScale;
        const c1y = ly + tipHalfWidth * xScale;
        canvas.lineTo(c1x,c1y);
        const c2x = lx + tipHalfWidth * yScale;
        const c2y = ly - tipHalfWidth * xScale;
        canvas.lineTo(c2x,c2y);
        canvas.lineWidth = 1;
        canvas.fill();
    }
    draw();


    return () => {
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
                    currRotation = (startRotation + deltaRotation) % 360;
                }
                else {
                    currRotation = (startRotation + goalDelta) % 360;
                }
                draw();
            }
            else {
                clearInterval(spinIntervalId);
            }
        }
    }
})();