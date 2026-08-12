import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("responsive primitive style contract", () => {
  it("documents a 44px target and fluid bounded layout dimensions", () => {
    const tokens = read("src/styles/tokens.css");
    const primitives = read("src/styles/primitives.css");
    expect(tokens).toContain("--size-target-min: 2.75rem");
    expect(primitives).toContain("min-inline-size: var(--size-target-min)");
    expect(primitives).toContain("minmax(min(100%, var(--size-grid-card-min)), 1fr)");
  });

  it("contains text, media, focus, and high-zoom fixed-element safeguards", () => {
    const primitives = read("src/styles/primitives.css");
    expect(primitives).toContain("overflow-wrap: anywhere");
    expect(primitives).toContain("max-inline-size: 100%");
    expect(primitives).toMatch(/\.fixed-zoom-safe[\s\S]*position: absolute/);
    expect(primitives).toMatch(/:focus-visible[\s\S]*z-index: 1/);
  });
});
