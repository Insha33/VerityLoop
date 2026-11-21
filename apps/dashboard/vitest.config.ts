import { defineConfig } from "vitest/config";

// Unit tests for plain logic: no browser and no DOM. Browser journeys live in tests/e2e (Playwright).
export default defineConfig({
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"] },
});
