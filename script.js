// Matrix effect with vertical text for intro
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "Loading Advaith Ravishankar's Profile".split("");
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(0);

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < columns; i++) {
    const index = (drops[i] + i) % letters.length;
    const text = letters[index];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let matrixInterval = setInterval(draw, 50);

function endMatrix() {
  clearInterval(matrixInterval);
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

setTimeout(endMatrix, 8000);
canvas.addEventListener("click", endMatrix);