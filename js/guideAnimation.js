function startAnimation() {
  const guide = document.querySelector(".guide");
  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    ease: "power3.inOut",
  });
  tl.to(guide, 0.8, { scale: 1.1 })
    .to(guide, 0.4, { x: 20 })
    .to(guide, 0.2, {
      x: -20,
    })
    .to(guide, 0.1, { x: 10 })
    .to(guide, 0.2, {
      x: -10,
    })
    .to(guide, 0.4, {
      x: 0,
    })
    .to(guide, 0.6, {
      x: 0,
      scale: 1,
    });
}

startAnimation();
