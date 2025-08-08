// Matrix effect with vertical text for intro
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "Loading ".split("");
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

// Title Name Typewrite effect
const typeTarget = document.getElementById("typewriter");
const phrases = ["Advaith Ravishankar", "AI/ML Researcher"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const delay = isDeleting ? 50 : 100;

  typeTarget.textContent = currentPhrase.substring(0, charIndex) + (charIndex % 2 === 0 ? "|" : "");

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    setTimeout(type, delay);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, delay);
  } else {
    setTimeout(() => {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      type();
    }, isDeleting ? 800 : 2500); // pause between transitions
  }
}

setTimeout(type, 1000);