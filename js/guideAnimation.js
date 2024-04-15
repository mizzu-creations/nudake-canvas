const guideAnimation = () => {
  const guide = document.querySelector(".guide");
  const isMobile = window.innerWidth < 769;

  const timeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    ease: "power3.inOut",
  });

  timeline.to(guide, 0.8, { scale: 1.1 });

  if (isMobile) {
    timeline
      .to(guide, 0.4, { xPercent: 10 })
      .to(guide, 0.2, { xPercent: -10 })
      .to(guide, 0.1, { xPercent: 5 })
      .to(guide, 0.2, { xPercent: -5 })
      .to(guide, 0.4, { xPercent: 0 });
  } else {
    timeline
      .to(guide, 0.4, { x: 20 })
      .to(guide, 0.2, { x: -20 })
      .to(guide, 0.1, { x: 10 })
      .to(guide, 0.2, { x: -10 })
      .to(guide, 0.4, { x: 0 });
  }

  timeline.to(guide, 0.6, { scale: 1 });

  return timeline;
};

export { guideAnimation };
