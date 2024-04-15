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

let canvasWidth, canvasHeight;
let currentIdx = 0;
let prevPos = { x: 0, y: 0 };

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  drawImg();
}

function drawImg() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const img = new Image();
  img.src = imgs[currentIdx];

  img.onload = () => {
    ctx.globalCompositeOperation = "source-over";
    drawImageCenter(canvas, ctx, img);

    const nextImage = imgs[(currentIdx + 1) % imgs.length];
    canvasParent.style.backgroundImage = `url(${nextImage})`;
  };
}

function onMouseDown(e) {
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  prevPos = { x: e.clientX, y: e.clientY };
}
function onMouseUp() {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}
function onMouseMove(e) {
  drawCircles(e);
  checkPercent();
  guideTxt.style.opacity = "0";
}

function drawCircles(e) {
  const nextPos = { x: e.clientX, y: e.clientY };
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

window.addEventListener("mousedown", onMouseDown);

window.addEventListener("load", () => {
  init();
  render();
});
window.addEventListener("resize", () => {
  init();
});
