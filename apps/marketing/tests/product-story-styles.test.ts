import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// jsdom doesn't expand the `animation` shorthand or resolve the full cascade, so this check reads
// the stylesheet source. It guards a bug where a later `animation` shorthand reset
// `animation-play-state`, so offscreen scenes kept animating.
const moduleCss = readFileSync(
  join(process.cwd(), "src/components/marketing/ProductStory.module.css"),
  "utf8",
);

function topLevelRules(css: string) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: { selector: string; body: string; index: number }[] = [];
  const pattern = /([^{}@]+)\{([^{}]*)\}/g;
  let depth = 0;
  let cursor = 0;
  for (let match = pattern.exec(withoutComments); match; match = pattern.exec(withoutComments)) {
    const between = withoutComments.slice(cursor, match.index);
    depth += (between.match(/\{/g) ?? []).length - (between.match(/\}/g) ?? []).length;
    cursor = pattern.lastIndex;
    if (depth === 0) rules.push({ selector: match[1].trim(), body: match[2], index: match.index });
  }
  return rules;
}

describe("product story styles", () => {
  it("pauses offscreen scenes after every rule that sets the animation shorthand", () => {
    const rules = topLevelRules(moduleCss);
    const pause = rules.find(
      (rule) =>
        rule.selector.includes(".stage[data-visible=false] .reveal") &&
        /animation-play-state:\s*paused/.test(rule.body),
    );
    const shorthands = rules.filter(
      (rule) =>
        /\.reveal|\.connection > span/.test(rule.selector) && /(^|;)\s*animation\s*:/.test(rule.body),
    );

    expect(pause).toBeDefined();
    expect(shorthands.length).toBeGreaterThan(0);
    for (const rule of shorthands) {
      expect(rule.index, `"${rule.selector}" must come before the pause rule`).toBeLessThan(
        pause!.index,
      );
    }
  });
});
