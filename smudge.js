const guideTxt = document.querySelector(".guide");

const canvasParent = document.querySelector(".nudake");
const canvas = document.querySelector(".nudake canvas");
const ctx = canvas.getContext("2d");
const imgs = Array.from(
  { length: 8 },
  (_, i) => `./images/canvas/${i + 1}.jpg`
);

let canvasWidth, canvasHeight;
let currentIdx = 0;

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

function onMouseDown() {
  console.log("down");
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
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
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(e.clientX, e.clientY, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
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
