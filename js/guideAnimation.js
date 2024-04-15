const guideAnimation = () => {
  const guide = document.querySelector(".guide");
  const isMobile = window.innerWidth < 769;

  const timeline = gsap
    .timeline({
      repeat: -1,
      yoyo: true,
      ease: "power3.inOut",
    })
    .to(guide, 0.8, { scale: 1.1 })
    .to(guide, 0.4, { xPercent: isMobile ? 10 : -40 })
    .to(guide, 0.2, { xPercent: isMobile ? -10 : -60 })
    .to(guide, 0.1, { xPercent: isMobile ? 10 : -40 })
    .to(guide, 0.2, { xPercent: isMobile ? -10 : -60 })
    .to(guide, 0.4, { xPercent: isMobile ? 0 : -50 })
    .to(guide, 0.6, { scale: 1 });

  return timeline;
};

export { guideAnimation };
