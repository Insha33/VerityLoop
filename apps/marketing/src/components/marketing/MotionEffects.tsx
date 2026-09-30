"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));

    const hero = document.querySelector<HTMLElement>(".hero");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trackPointer = (event: PointerEvent) => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      hero.style.setProperty("--pointer-x", `${x}%`);
      hero.style.setProperty("--pointer-y", `${y}%`);
    };
    if (hero && !reducedMotion) hero.addEventListener("pointermove", trackPointer, { passive: true });

    return () => {
      observer.disconnect();
      hero?.removeEventListener("pointermove", trackPointer);
    };
  }, []);

  return null;
}
