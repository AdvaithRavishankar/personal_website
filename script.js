// Matrix effect with vertical text for intro
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function sizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}
sizeCanvas();

const letters = "Loading ".split("");
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = new Array(columns).fill(0);

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

// Keep matrix responsive
window.addEventListener("resize", () => {
  sizeCanvas();
  columns = Math.floor(canvas.width / fontSize);
  drops = new Array(columns).fill(0);
});

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

// =====================
// Reel duplication & Experience expand (unchanged)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const reelTrack = document.querySelector(".reel-track");
  if (reelTrack) {
    const images = Array.from(reelTrack.children);
    images.forEach((img) => reelTrack.appendChild(img.cloneNode(true)));
  }

  const main = document.getElementById("main-content");
  let overlay = document.getElementById("expander-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "expander-overlay";
    overlay.className = "expander-overlay";
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }

  const cards = Array.from(document.querySelectorAll(".exp-card"));
  let expander = null;
  let activeCard = null;
  let activeCardHTML = "";
  let cardData = [];

  fetch("data.json")
    .then((r) => r.json())
    .then((data) => { if (Array.isArray(data)) cardData = data; })
    .catch(() => {
      cardData = cards.map(() => ({
        img: "assets/temp.png",
        description: "temp description line 1\ntemp description line 2\ntemp description line 3\ntemp description line 4\ntemp description line 5"
      }));
    });

  function descriptionToHTML(text) {
    return (text || "temp description")
      .split("\n")
      .slice(0, 8)
      .map((line) => `<p>${line || " "}</p>`)
      .join("");
  }

  function openExpander(card) {
    if (expander) return;
    activeCard = card;
    activeCardHTML = card.innerHTML;
    card.classList.add("exp-blank");
    card.innerHTML = "";

    const rect = card.getBoundingClientRect();
    overlay.hidden = false;
    overlay.classList.add("show");
    main.classList.add("blurred");

    expander = document.createElement("div");
    expander.className = "expander";
    expander.style.top = rect.top + "px";
    expander.style.left = rect.left + "px";
    expander.style.width = rect.width + "px";
    expander.style.height = rect.height + "px";
    overlay.appendChild(expander);

    const idx = cards.indexOf(card);
    const data = cardData[idx] || { img: "assets/temp.png", description: "temp description line 1\ntemp description line 2\ntemp description line 3" };

    requestAnimationFrame(() => { expander.classList.add("to-center"); });

    const onEnd = (e) => {
      if (!["transform", "width", "height", "top", "left"].includes(e.propertyName)) return;
      expander.removeEventListener("transitionend", onEnd);
      expander.classList.add("loaded");
      expander.innerHTML = `
        <img class="expander-img" src="${data.img || "assets/temp.png"}" alt="detail">
        <div class="expander-body">
          ${descriptionToHTML(data.description)}
        </div>
      `;
    };
    expander.addEventListener("transitionend", onEnd, { once: true });
  }

  function closeExpander() {
    if (!expander || !activeCard) return;

    const rect = activeCard.getBoundingClientRect();
    expander.classList.remove("loaded");
    expander.innerHTML = "";
    expander.style.top = rect.top + "px";
    expander.style.left = rect.left + "px";
    expander.style.width = rect.width + "px";
    expander.style.height = rect.height + "px";
    expander.classList.remove("to-center");

    const onEnd = () => {
      expander.removeEventListener("transitionend", onEnd);
      overlay.classList.remove("show");
      overlay.hidden = true;
      expander.remove();
      expander = null;

      activeCard.innerHTML = activeCardHTML;
      activeCard.classList.remove("exp-blank");
      activeCard = null;
      activeCardHTML = "";

      main.classList.remove("blurred");
    };
    expander.addEventListener("transitionend", onEnd, { once: true });
  }

  cards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      openExpander(card);
    });
  });

  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeExpander(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeExpander(); });
});
