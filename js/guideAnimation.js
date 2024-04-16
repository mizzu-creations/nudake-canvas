import { isMobileDevice } from "./utils.js";

const guideAnimation = () => {
  const guide = document.querySelector(".guide");
  const isMobile = isMobileDevice();
  const isMobilesize = window.innerWidth < 769;
  const timeline = isMobile
    ? gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          ease: "power3.inOut",
        })
        .to(guide, 0.8, { scale: 1.2 })
        .to(guide, 0.4, { x: 10 })
        .to(guide, 0.2, { x: -10 })
        .to(guide, 0.1, { x: 10 })
        .to(guide, 0.2, { x: -10 })
        .to(guide, 0.2, { x: 0 })
        .to(guide, 0.6, { scale: 1 })
    : gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          ease: "power3.inOut",
        })
        .to(guide, 0.8, { scale: 1.1 })
        .to(guide, 0.4, { xPercent: isMobilesize ? 10 : -40 })
        .to(guide, 0.2, { xPercent: isMobilesize ? -10 : -60 })
        .to(guide, 0.1, { xPercent: isMobilesize ? 10 : -40 })
        .to(guide, 0.2, { xPercent: isMobilesize ? -10 : -60 })
        .to(guide, 0.2, { xPercent: isMobilesize ? 0 : -50 })
        .to(guide, 0.6, { scale: 1 });

  return timeline;
};

export { guideAnimation };
