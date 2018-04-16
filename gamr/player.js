var a = .00005;

var spinner = document.getElementById('spinner');
var spinIntervalId;
var startRotation = Math.random() * 360;
var currRotation = startRotation;

function rotate() {
    var mod = currRotation % 360;
    spinner.style.transform = 'rotate(' + mod + 'deg)';
}
rotate();

function spin() {
    var goalDelta = Math.random() * 720 + 1440;
    var b = - ((24 * (a ** 2) * goalDelta) ** (1/3));
    var c = (b ** 2) / (4 * a);
    var tFinal = - (b / (2 * a)); 

    startRotation = currRotation;
    var t = 0;

    if (spinIntervalId) {
        clearInterval(spinIntervalId);
    }
    spinIntervalId = setInterval(frame, 5);

    function frame() {
        t++;
        var calc = (a * (t ** 2)) + (b * t) + c; 
        currRotation += calc;
        rotate();
        if (t >= tFinal) {
            clearInterval(spinIntervalId);
        }
    }
}
