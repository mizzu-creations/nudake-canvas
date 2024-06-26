function getDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function getAngle(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx);
}

function getScrupedPercent(ctx, width, height) {
  const pixels = ctx.getImageData(0, 0, width, height).data;
  const gap = 32;
  const total = pixels.length / gap;
  let count = 0;
  for (let i = 0; i < pixels.length - 3; i += gap) {
    if (pixels[i + 3] === 0) count++;
  }
  return Math.round((count / total) * 100);
}

function drawImageCenter(canvas, ctx, image) {
  const cw = canvas.width;
  const ch = canvas.height;

  const iw = image.width;
  const ih = image.height;

  const ir = ih / iw;
  const cr = ch / cw;

  let sx, sy, sw, sh;

  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw);
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }

  sx = iw / 2 - sw / 2;
  sy = ih / 2 - sh / 2;
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
}

function isMobileDevice() {
  const userAgent = navigator.userAgent;
  const mobile = /(iPhone|iPad|Android|BlackBerry|Windows Phone)/i.test(
    userAgent
  );
  return mobile;
}

function setVh() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export {
  getDistance,
  getAngle,
  getScrupedPercent,
  drawImageCenter,
  isMobileDevice,
  setVh,
};
