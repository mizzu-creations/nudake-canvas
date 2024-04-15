import {
  getDistance,
  getAngle,
  getScrupedPercent,
  drawImageCenter,
} from "./utils.js";

const guideTxt = document.querySelector(".guide");

const canvasParent = document.querySelector(".nudake");
const canvas = document.querySelector(".nudake canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const imgs = Array.from(
  { length: 8 },
  (_, i) => `./images/canvas/${i + 1}.jpg`
);
const loadedImgs = [];

let canvasWidth, canvasHeight;
let currentIdx = 0;
let prevPos = { x: 0, y: 0 };
let isChanging = false;

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  preloadImages().then(() => drawImg());
}

function preloadImages() {
  return new Promise((resolve, _) => {
    let loaded = 0;
    imgs.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded += 1;
        loadedImgs.push(img);
        if (loaded === imgs.length) return resolve();
      };
    });
  });
}

function drawImg() {
  isChanging = true;
  const img = loadedImgs[currentIdx];
  const firstDrawing = ctx.globalCompositeOperation === "source-over";
  gsap.to(canvas, {
    opacity: 0,
    duration: firstDrawing ? 0 : 1,
    onComplete: () => {
      canvas.style.opacity = 1;
      ctx.globalCompositeOperation = "source-over";
      drawImageCenter(canvas, ctx, img);

      const nextImage = imgs[(currentIdx + 1) % imgs.length];
      canvasParent.style.backgroundImage = `url(${nextImage})`;
      prevPos = null;

      isChanging = false;
    },
  });
}

function onMouseDown(e) {
  if (isChanging) return;
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  prevPos = { x: e.clientX, y: e.clientY };
}
function onMouseUp() {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}
function onMouseMove(e) {
  if (isChanging) return;
  drawCircles(e);
  checkPercent();
  guideTxt.style.opacity = "0";
}

function drawCircles(e) {
  const nextPos = { x: e.clientX, y: e.clientY };
  if (!prevPos) prevPos = nextPos;
  const dist = getDistance(prevPos, nextPos);
  const angle = getAngle(prevPos, nextPos);

  for (let i = 0; i < dist; i++) {
    const x = prevPos.x + Math.cos(angle) * i;
    const y = prevPos.y + Math.sin(angle) * i;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, canvasWidth / 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  prevPos = nextPos;
}
const checkPercent = _.throttle(() => {
  const percent = getScrupedPercent(ctx, canvasWidth, canvasHeight);
  if (percent > 50) {
    currentIdx = (currentIdx + 1) % imgs.length;
    drawImg();
  }
}, 500);

function render() {
  requestAnimationFrame(render);
}

window.addEventListener("load", () => {
  const progressBar = document.querySelector(".progress-bar");
  const progressGage = progressBar.querySelector(".gage");
  const isMobile = window.innerWidth < 769;

  init();

  gsap.to(progressBar, {
    width: isMobile ? 139 : 248,
    duration: 0.5,
    transformOrigin: "100% 50%",
  });
  gsap.to(canvasParent, {
    opacity: 1,
    delay: 0.5,
    duration: 2,
    onUpdate: updateProgress,
    onComplete: completeAnimation,
  });

  function updateProgress() {
    const opacityPercentage = Math.round(canvasParent.style.opacity * 100);
    progressGage.style.width = `${opacityPercentage}%`;
    if (opacityPercentage === 100) {
      window.addEventListener("mousedown", onMouseDown);
    }
  }
  function completeAnimation() {
    gsap.to(progressBar, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        guideTxt.style.opacity = 1;
      },
    });
    render();
  }
});
window.addEventListener("resize", () => {
  init();
});
