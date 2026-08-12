export const MEDIA_QUALITY_THRESHOLD = 0.95;
export const CRITICAL_MEDIA_BUDGET_BYTES = 200 * 1024;
export const PROJECT_MEDIA_BUDGET_BYTES = 150 * 1024;

export type MediaKind = "critical" | "project";
export type SupportedMediaMimeType =
  | "image/avif"
  | "image/webp"
  | "image/jpeg"
  | "image/png";

export interface ImageCandidate {
  readonly url: string;
  readonly intrinsicWidth: number;
  readonly intrinsicHeight: number;
  readonly bytes: number;
  readonly quality: number;
  readonly mimeType: SupportedMediaMimeType;
}

export interface MediaRequest {
  readonly kind: MediaKind;
  readonly renderedWidth: number;
  readonly density: number;
  readonly candidates: readonly ImageCandidate[];
}

export type MediaDecision =
  | { readonly kind: "request"; readonly candidate: ImageCandidate }
  | {
      readonly kind: "reserve-only";
      readonly reason: "no-quality-project-candidate";
    };

export function assertSupportedMediaRequest(
  renderedWidth: number,
  density: number,
): void {
  if (
    !Number.isFinite(renderedWidth) ||
    renderedWidth < 1 ||
    renderedWidth > 2560
  ) {
    throw new RangeError("renderedWidth must be between 1 and 2560 CSS pixels");
  }
  if (!Number.isFinite(density) || density < 1 || density > 4) {
    throw new RangeError("density must be between 1 and 4");
  }
}

function assertAvailableWidths(widths: readonly number[]): void {
  if (widths.length === 0) {
    throw new RangeError("at least one source width is required");
  }
  if (!widths.every(width => Number.isInteger(width) && width > 0)) {
    throw new RangeError("source widths must be positive integers");
  }
}

/** Selects the smallest source in [target, 2 * target], or the nearest source. */
export function selectMediaWidth(
  widths: readonly number[],
  renderedWidth: number,
  density: number,
): number {
  assertSupportedMediaRequest(renderedWidth, density);
  assertAvailableWidths(widths);

  const target = renderedWidth * density;
  let qualifyingWidth: number | undefined;

  for (const width of widths) {
    if (
      width >= target &&
      width <= 2 * target &&
      (qualifyingWidth === undefined || width < qualifyingWidth)
    ) {
      qualifyingWidth = width;
    }
  }

  if (qualifyingWidth !== undefined) return qualifyingWidth;

  return widths.reduce((selected, width) => {
    const selectedDistance = Math.abs(selected - target);
    const distance = Math.abs(width - target);
    return distance < selectedDistance ||
      (distance === selectedDistance && width < selected)
      ? width
      : selected;
  });
}

function budgetFor(kind: MediaKind): number {
  return kind === "critical"
    ? CRITICAL_MEDIA_BUDGET_BYTES
    : PROJECT_MEDIA_BUDGET_BYTES;
}

function smallestPayload(
  candidates: readonly ImageCandidate[],
): ImageCandidate | undefined {
  let selected: ImageCandidate | undefined;
  for (const candidate of candidates) {
    if (selected === undefined || candidate.bytes < selected.bytes) {
      selected = candidate;
    }
  }
  return selected;
}

/** Applies quality first, then byte-budget and smallest-payload precedence. */
export function selectMediaPayload(
  kind: MediaKind,
  candidates: readonly ImageCandidate[],
): MediaDecision {
  const qualityCandidates = candidates.filter(
    candidate => candidate.quality >= MEDIA_QUALITY_THRESHOLD,
  );
  const withinBudget = qualityCandidates.filter(
    candidate => candidate.bytes <= budgetFor(kind),
  );
  const candidate =
    smallestPayload(withinBudget) ?? smallestPayload(qualityCandidates);

  if (candidate !== undefined) return { kind: "request", candidate };
  if (kind === "project") {
    return {
      kind: "reserve-only",
      reason: "no-quality-project-candidate",
    };
  }

  throw new RangeError(
    "critical media requires a quality-meeting payload at the selected width",
  );
}

/** Selects one source width before considering payload quality or byte size. */
export function selectMedia(request: MediaRequest): MediaDecision {
  assertSupportedMediaRequest(request.renderedWidth, request.density);
  if (request.candidates.length === 0) {
    throw new RangeError("at least one media candidate is required");
  }

  const selectedWidth = selectMediaWidth(
    request.candidates.map(candidate => candidate.intrinsicWidth),
    request.renderedWidth,
    request.density,
  );
  const selectedSourceCandidates = request.candidates.filter(
    candidate => candidate.intrinsicWidth === selectedWidth,
  );

  return selectMediaPayload(request.kind, selectedSourceCandidates);
}
