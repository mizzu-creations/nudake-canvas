import {
  getDistance,
  getAngle,
  getScrupedPercent,
  drawImageCenter,
  isMobileDevice,
  setVh,
} from "./utils.js";
import { guideAnimation } from "./guideAnimation.js";

const guideTxt = document.querySelector(".guide");
const guideDim = document.querySelector(".dim");
const guideAni = guideAnimation();

const progressBar = document.querySelector(".progress-bar");
const progressGage = progressBar.querySelector(".gage");

const canvas = document.querySelector("canvas");
const canvasParent = canvas.parentNode;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const imgs = Array.from(
  { length: 8 },
  (_, i) => `./images/canvas/${i + 1}.jpg`
).sort(() => Math.random() - 0.5);

const loadedImgs = [];

let canvasWidth, canvasHeight;
let currentIdx = 0;
let prevPos = { x: 0, y: 0 };
let isChanging = false;
let isMobile;

function init() {
  canvasWidth = canvasParent.clientWidth;
  canvasHeight = canvasParent.clientHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  isMobile = isMobileDevice();
  preloadImages().then(() => {
    drawImg();
    updateProgress();
  });
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

function addEventListeners() {
  if (isMobile) {
    window.addEventListener("touchstart", onMouseDown);
  } else {
    window.addEventListener("mousedown", onMouseDown);
  }
}

function updateProgress() {
  const opacityPercentage = Math.round(canvasParent.style.opacity * 100);
  progressGage.style.width = `${opacityPercentage}%`;

  if (opacityPercentage === 100) {
    addEventListeners();
  }
}

function onMouseDown(e) {
  if (isChanging) return;
  if (isMobile) {
    window.addEventListener("touchend", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);
  } else {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  }

  prevPos = {
    x: isMobile ? e.changedTouches[0].clientX : e.clientX,
    y: isMobile ? e.changedTouches[0].clientY : e.clientY,
  };
}
function onMouseUp() {
  if (isMobile) {
    window.removeEventListener("touchend", onMouseUp);
    window.removeEventListener("touchmove", onMouseMove);
  } else {
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mouseleave", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  }
}
function onMouseMove(e) {
  if (isChanging) return;
  drawCircles(e);
  checkPercent();
  gsap.to(guideTxt, { opacity: 0, duration: 1 });
  gsap.to(guideDim, { opacity: 0, duration: 1 });
  guideAni.kill();
}

function drawCircles(e) {
  const nextPos = {
    x: isMobile ? e.changedTouches[0].clientX : e.clientX,
    y: isMobile ? e.changedTouches[0].clientY : e.clientY,
  };
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
}, 1000);

window.addEventListener("load", () => {
  const isMobileSize = window.innerWidth < 769;

  setVh();
  init();

  gsap.to(progressBar, {
    width: isMobileSize ? 139 : 248,
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
  function completeAnimation() {
    gsap.to(progressBar, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.to(guideTxt, { opacity: 1, duration: 1 });
        guideAni;
      },
    });
  }
});
window.addEventListener(
  "resize",
  _.throttle(() => {
    location.reload();
  }, 2000)
);
