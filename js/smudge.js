import { getDistance, getAngle } from "./utils.js";

const guideTxt = document.querySelector(".guide");

const canvas = document.querySelector(".nudake canvas");
const ctx = canvas.getContext("2d");
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
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  };
}

function onMouseDown(e) {
  console.log("down");
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  prevPos = { x: e.clientX, y: e.clientY };
}
function onMouseUp() {
  console.log("up");
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}
function onMouseMove(e) {
  console.log("move");
  drawCircles(e);
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
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  prevPos = nextPos;
}

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
