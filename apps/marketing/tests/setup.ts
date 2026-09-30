import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach } from "vitest";

const globalStyles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const faqStyles = globalStyles.slice(
  globalStyles.indexOf(".faq-section { display"),
  globalStyles.indexOf(".waitlist-section { position"),
);

const productionStyles = document.createElement("style");
productionStyles.textContent = faqStyles;
document.head.append(productionStyles);

afterEach(() => cleanup());

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  disconnect() {}
  observe(target: Element) {
    target.classList.add("is-visible");
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  value: IntersectionObserverStub,
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }),
});
