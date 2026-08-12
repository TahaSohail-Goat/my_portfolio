import { describe, expect, it } from "vitest";
import {
  CRITICAL_MEDIA_BUDGET_BYTES,
  PROJECT_MEDIA_BUDGET_BYTES,
  selectMedia,
  selectMediaPayload,
  selectMediaWidth,
  type ImageCandidate,
} from "@/lib/media-selection";

function candidate(
  url: string,
  intrinsicWidth: number,
  bytes: number,
  quality = 0.95,
): ImageCandidate {
  return {
    url,
    intrinsicWidth,
    intrinsicHeight: intrinsicWidth,
    bytes,
    quality,
    mimeType: "image/avif",
  };
}

describe("selectMediaWidth", () => {
  it("selects the smallest source in the inclusive target-to-double-target range", () => {
    expect(selectMediaWidth([800, 400, 200, 401], 200, 2)).toBe(400);
    expect(selectMediaWidth([801, 800, 399], 200, 2)).toBe(800);
  });

  it("selects the nearest source when no source qualifies without mutating widths", () => {
    const widths = [2000, 320, 640] as const;
    expect(selectMediaWidth(widths, 400, 2)).toBe(640);
    expect(widths).toEqual([2000, 320, 640]);
  });

  it.each([
    [0, 1],
    [2560.01, 1],
    [Number.NaN, 1],
    [320, 0.99],
    [320, 4.01],
    [320, Number.POSITIVE_INFINITY],
  ])("rejects unsupported rendered width %s or density %s", (width, density) => {
    expect(() => selectMediaWidth([320], width, density)).toThrow(RangeError);
  });
});

describe("selectMediaPayload", () => {
  it("chooses the smallest quality-meeting critical payload within 200 KiB", () => {
    const smallest = candidate("/small.avif", 640, 80_000, 0.95);
    const decision = selectMediaPayload("critical", [
      candidate("/failed-quality.avif", 640, 1, 0.949999),
      candidate("/budget-edge.avif", 640, CRITICAL_MEDIA_BUDGET_BYTES, 0.99),
      smallest,
    ]);

    expect(decision).toEqual({ kind: "request", candidate: smallest });
  });

  it("falls back to the smallest quality-meeting critical payload over budget", () => {
    const smallest = candidate(
      "/smallest-over-budget.webp",
      640,
      CRITICAL_MEDIA_BUDGET_BYTES + 1,
    );
    expect(
      selectMediaPayload("critical", [
        candidate("/larger.webp", 640, 400_000),
        smallest,
      ]),
    ).toEqual({ kind: "request", candidate: smallest });
  });

  it("uses the 150 KiB project budget and returns reserve-only when quality is absent", () => {
    const atBudget = candidate(
      "/at-project-budget.avif",
      640,
      PROJECT_MEDIA_BUDGET_BYTES,
    );
    expect(
      selectMediaPayload("project", [
        candidate("/too-large.avif", 640, PROJECT_MEDIA_BUDGET_BYTES + 1),
        atBudget,
      ]),
    ).toEqual({ kind: "request", candidate: atBudget });

    expect(
      selectMediaPayload("project", [
        candidate("/low-quality.avif", 640, 10, 0.949999),
      ]),
    ).toEqual({
      kind: "reserve-only",
      reason: "no-quality-project-candidate",
    });
  });

  it("rejects a critical selected width without a quality-meeting payload", () => {
    expect(() =>
      selectMediaPayload("critical", [
        candidate("/low-quality.avif", 640, 10, 0.94),
      ]),
    ).toThrow(/critical media requires/);
  });
});

describe("selectMedia", () => {
  it("applies payload precedence only within the selected source width", () => {
    const selected = candidate("/selected.avif", 640, 100_000);
    const decision = selectMedia({
      kind: "critical",
      renderedWidth: 320,
      density: 2,
      candidates: [
        candidate("/smaller-other-width.avif", 320, 1),
        candidate("/larger-selected.webp", 640, 120_000),
        selected,
      ],
    });

    expect(decision).toEqual({ kind: "request", candidate: selected });
  });

  it("returns reserve-only for a selected project width even if another width meets quality", () => {
    expect(
      selectMedia({
        kind: "project",
        renderedWidth: 320,
        density: 2,
        candidates: [
          candidate("/other-width.avif", 320, 1),
          candidate("/selected-low-quality.avif", 640, 1, 0.9),
        ],
      }),
    ).toEqual({
      kind: "reserve-only",
      reason: "no-quality-project-candidate",
    });
  });
});
