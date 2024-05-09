const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const setpoint = document.getElementById('setpoint');
const KpInput = document.getElementById('Kp');
const KiInput = document.getElementById('Ki');
const KdInput = document.getElementById('Kd');

const noiseInput = document.getElementById('noise');
let noiseAmplitude = parseFloat(noiseInput.value);

let currentValue = 50;
let targetValue = parseFloat(setpoint.value);
let lastError = 0;
let integral = 0;
let time = 0;

let Kp = parseFloat(KpInput.value);
let Ki = parseFloat(KiInput.value);
let Kd = parseFloat(KdInput.value);

const history = [];
let targetHistory = [];

let values = [];
let timeStep = 0;
let pidOutputs = [];
let noiseHistory = [];

const T_WIDTH = 2; // 這表示每個T的間隔為2像素。您可以根據需要更改此值。


const resetBtn = document.getElementById('resetBtn');

function drawLine(data, color) {
    if (data.length === 0) return;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - data[0] * 4);
    
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(i * T_WIDTH, canvas.height - data[i] * 4);
    }
    
    ctx.strokeStyle = color;
    ctx.stroke();
}

function reset() {
    currentValue = 50;
    targetValue = 50;
    lastError = 0;
    integral = 0;
    time = 0;
    history.length = 0;
    Kp = 0.6;
    Ki = 0.06;
    Kd = 0.01;
    setpoint.value = targetValue;
    KpInput.value = Kp;
    KiInput.value = Ki;
    KdInput.value = Kd;

}
function drawCurrentValues() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - values[0] * 4);
    for(let i = 1; i < values.length; i++) {
        ctx.lineTo(i, canvas.height - values[i] * 4);
    }
    ctx.strokeStyle = "blue"; // Color for the current value line
    ctx.stroke();
}
function drawPidOutputs() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - pidOutputs[0] * 4);
    for(let i = 1; i < pidOutputs.length; i++) {
        ctx.lineTo(i, canvas.height - pidOutputs[i] * 4);
    }
    ctx.strokeStyle = "green"; // Color for the PID output line
    ctx.stroke();
}

function drawAxes() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    let yInterval = canvas.height / 10;
    let xInterval = canvas.width / 10;

    // Draw Y-Axis lines and labels
    for(let i = 0; i <= 10; i++) {
        let y = yInterval * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
       // ctx.fillText((10 - i) * 10, 0, y); // Adjust this for your range and scale
    }

    // Draw X-Axis lines and labels (assuming it's time and max is 10)
    for(let i = 0; i <= 10; i++) {
        let x = xInterval * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
       // ctx.fillText(i, x, canvas.height); 
    }
}

resetBtn.addEventListener('click', reset);
let lastTime = Date.now();
let lastTargetValue = targetValue;
let lastCurrentValue = currentValue;
const MIN_INTEGRAL = 5;  // 設定適當的最小值
const MAX_INTEGRAL = 95;   // 設定適當的最大值

function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds

    const error = targetValue - currentValue;
    integral += error * deltaTime; // Use deltaTime for more accurate integral
    integral = Math.max(MIN_INTEGRAL, Math.min(MAX_INTEGRAL, integral)); // Anti-windup

    const derivative = (error - lastError) / deltaTime; // More accurate derivative

    const output = Kp * error + Ki * integral + Kd * derivative;
    const noise = (Math.random() * 2 - 1) * noiseAmplitude;

    currentValue += output + noise; // Adding noise to the current value

    // Ensure values remain within canvas bounds
    currentValue = Math.max(0, Math.min(canvas.height / 4, currentValue));

    // Record data
    targetHistory.push(targetValue); // Saving original target value
    values.push(currentValue);
    noiseHistory.push(currentValue + noise);  // This is now redundant, but kept for consistency.

    if (values.length > canvas.width / T_WIDTH) {
        values.shift();
        targetHistory.shift();
        noiseHistory.shift();
    }

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    //console.log(values);
    //console.log(noiseHistory);

    if (document.getElementById('showTarget').checked) {
        drawLine(targetHistory, "red");
    }
    if (document.getElementById('showCurrent').checked) {
        drawLine(values, "blue");
    }
    if (document.getElementById('showNoise').checked) {
        drawLine(noiseHistory, "orange");
    }

    lastError = error;
    lastTime = currentTime;
    lastTargetValue = targetValue;
    lastCurrentValue = currentValue;

    requestAnimationFrame(update);
}



// Existing event listeners
setpoint.addEventListener('input', () => {
    targetValue = parseFloat(setpoint.value);
});
setpoint.addEventListener('input', () => {
    targetValue = parseFloat(setpoint.value);
    document.getElementById('setpointValue').textContent = targetValue.toFixed(2);
});

KpInput.addEventListener('input', () => {
    Kp = parseFloat(KpInput.value);
    document.getElementById('KpValue').textContent = Kp.toFixed(2);
});

KiInput.addEventListener('input', () => {
    Ki = parseFloat(KiInput.value);
    document.getElementById('KiValue').textContent = Ki.toFixed(2);
});

KdInput.addEventListener('input', () => {
    Kd = parseFloat(KdInput.value);
    document.getElementById('KdValue').textContent = Kd.toFixed(2);
});

noiseInput.addEventListener('input', () => {
    noiseAmplitude = parseFloat(noiseInput.value);
    document.getElementById('noiseValue').textContent = noiseAmplitude.toFixed(2);
});
[KpInput, KiInput, KdInput].forEach(input => {
    input.addEventListener('input', () => {
        Kp = parseFloat(KpInput.value);
        Ki = parseFloat(KiInput.value);
        Kd = parseFloat(KdInput.value);
    });
});
window.onload = function() {
    reset();
};

setpoint.addEventListener('input', () => {
    targetValue = parseFloat(setpoint.value);
    document.getElementById('setpointValue').textContent = targetValue.toFixed(2);
});


// Start the animation loop
update();
