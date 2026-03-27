import type { RootState } from "../../../app/store";
import { selectMap } from "../ScenarioSlice";
import {
  selectSortedByElevation,
  waterTableElevationFt,
} from "../flowDirection/flowSlice";

export type Pt = { x: number; y: number };
export const distance = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const unitVectorFromRaphaelAngle = (deg: number) => {
  const r = toRad(deg);
  return { x: Math.cos(r), y: Math.sin(r) };
};

const slopeVal = (a: Pt, b: Pt) => {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  return dx !== 0 ? dy / dx : NaN;
};
const perpSlopeVal = (a: Pt, b: Pt) => {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const x = -dy,
    y = dx;
  return x !== 0 ? y / x : NaN;
};
export const pointOnLine = (a: Pt, b: Pt, d: number): Pt => {
  const total = distance(a, b);
  if (total === 0) return { ...a };
  return {
    x: a.x + d * ((b.x - a.x) / total),
    y: a.y + d * ((b.y - a.y) / total),
  };
};

/** Barycentric-style inside test (matches Raphael triangle fill for non-degenerate triangles). */
export function isPointInTriangle(p: Pt, a: Pt, b: Pt, c: Pt): boolean {
  const sign = (p1: Pt, p2: Pt, p3: Pt) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

/**
 * Legacy `DrawingHelper.drawMeasuredLine`: offset segment parallel to edge AB,
 * short “bounding” ticks from wells A and B toward that segment, arrow inset.
 * `c` is the third triangle vertex (opposite edge AB).
 */
export type LegacyMeasuredLineGeom = {
  segmentStart: Pt;
  segmentEnd: Pt;
  cap1Start: Pt;
  cap1End: Pt;
  cap2Start: Pt;
  cap2End: Pt;
  labelMid: Pt;
};

export function legacyMeasuredLineGeometry(
  a: Pt,
  b: Pt,
  c: Pt,
  opts?: {
    offsetPx?: number;
    arrowInsetPx?: number;
    capHalfLengthPx?: number;
  },
): LegacyMeasuredLineGeom | null {
  const offsetPx = opts?.offsetPx ?? 20;
  const arrowInsetPx = opts?.arrowInsetPx ?? 4;
  const capHalfLengthPx = opts?.capHalfLengthPx ?? 10;

  const slopeAB = { x: b.x - a.x, y: b.y - a.y };
  const perpSlope = { x: -slopeAB.y, y: slopeAB.x };

  const midAB = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  let test1 = { x: midAB.x + perpSlope.x, y: midAB.y + perpSlope.y };
  test1 = pointOnLine(midAB, test1, 1);

  const inside = isPointInTriangle(test1, a, b, c);

  const dFar = inside
    ? { x: a.x - perpSlope.x, y: a.y - perpSlope.y }
    : { x: a.x + perpSlope.x, y: a.y + perpSlope.y };
  const eFar = inside
    ? { x: b.x - perpSlope.x, y: b.y - perpSlope.y }
    : { x: b.x + perpSlope.x, y: b.y + perpSlope.y };

  const d = pointOnLine(a, dFar, offsetPx);
  const e = pointOnLine(b, eFar, offsetPx);

  const deLen = distance(d, e);
  if (deLen < 1e-6) return null;

  const inset = Math.min(arrowInsetPx, deLen / 2 - 1e-3);
  const segmentStart = pointOnLine(d, e, Math.max(0, inset));
  const segmentEnd = pointOnLine(d, e, deLen - Math.max(0, inset));

  const cap1Start = pointOnLine(a, d, offsetPx - capHalfLengthPx);
  const cap1End = pointOnLine(a, d, offsetPx + capHalfLengthPx);
  const cap2Start = pointOnLine(b, e, offsetPx - capHalfLengthPx);
  const cap2End = pointOnLine(b, e, offsetPx + capHalfLengthPx);

  const labelMid = { x: (d.x + e.x) / 2, y: (d.y + e.y) / 2 };

  return {
    segmentStart,
    segmentEnd,
    cap1Start,
    cap1End,
    cap2Start,
    cap2End,
    labelMid,
  };
}
export const findIntersectionPoint = (a: Pt, b: Pt, c: Pt, d: Pt): Pt => {
  const m1 = slopeVal(a, b),
    m2 = slopeVal(c, d);
  let x: number;
  if (Number.isNaN(m1)) x = a.x;
  else if (Number.isNaN(m2)) x = c.x;
  else x = (m1 * a.x - m2 * c.x + c.y - a.y) / (m1 - m2);
  const y = Number.isNaN(m1) ? m2 * (x - c.x) + c.y : m1 * (x - a.x) + a.y;
  return { x, y };
};
export const findPerpPoint = (a: Pt, b: Pt, p: Pt): Pt => {
  const m = slopeVal(a, b),
    mp = perpSlopeVal(a, b);
  const x = (p.y - mp * p.x + m * a.x - a.y) / (m - mp);
  const y = mp * (x - p.x) + p.y;
  return { x, y };
};

export function computeActualFlowDirectionAngle(s: RootState): number | null {
  const map = selectMap(s);
  const sorted = (selectSortedByElevation as any)(s);
  if (!map || sorted.length < 3) return null;
  const lo = sorted[0],
    mid = sorted[1],
    hi = sorted[2];
  const ratioFtPerPx = (map.physicalWidth * 5280) / map.width;
  const hiEl = waterTableElevationFt(hi);
  const midEl = waterTableElevationFt(mid);
  const loEl = waterTableElevationFt(lo);
  const diffHighLow = Math.round((hiEl - loEl) * 10) / 10;
  const diffHighMid = Math.round((hiEl - midEl) * 10) / 10;
  if (diffHighLow === 0) return null;
  const elevationRatio = Number((diffHighMid / diffHighLow).toFixed(2));
  const dHighLowFt = Math.round(distance(hi.Point, lo.Point) * ratioFtPerPx);
  const dToIntersectionFt = Math.round(dHighLowFt * elevationRatio);
  const dToIntersectionPx = dToIntersectionFt / ratioFtPerPx;
  const intersection = pointOnLine(hi.Point, lo.Point, dToIntersectionPx);
  const foot = findPerpPoint(mid.Point, intersection, hi.Point);
  const ang =
    (Math.atan2(foot.y - hi.Point.y, foot.x - hi.Point.x) * 180) / Math.PI;
  const angle360 = (ang + 360) % 360;
  return Math.round(angle360);
}

export function computeYLengthFeet(s: RootState): number | null {
  const map = selectMap(s);
  const sorted = (selectSortedByElevation as any)(s);
  if (!map || sorted.length < 3) return null;
  const lo = sorted[0],
    mid = sorted[1],
    hi = sorted[2];
  const ratioFtPerPx = (map.physicalWidth * 5280) / map.width;
  const hiEl = waterTableElevationFt(hi);
  const midEl = waterTableElevationFt(mid);
  const loEl = waterTableElevationFt(lo);
  const diffHighLow = Math.round((hiEl - loEl) * 10) / 10;
  const diffHighMid = Math.round((hiEl - midEl) * 10) / 10;
  if (diffHighLow === 0) return null;
  const elevationRatio = Number((diffHighMid / diffHighLow).toFixed(2));
  const dHighLowFt = Math.round(distance(hi.Point, lo.Point) * ratioFtPerPx);
  const dToIntersectionFt = Math.round(dHighLowFt * elevationRatio);
  const dToIntersectionPx = dToIntersectionFt / ratioFtPerPx;
  const intersection = pointOnLine(hi.Point, lo.Point, dToIntersectionPx);
  const foot = findPerpPoint(mid.Point, intersection, hi.Point);
  return Math.round(distance(hi.Point, foot) * ratioFtPerPx);
}

export function computeGradientValue(s: RootState): number | null {
  const sorted = (selectSortedByElevation as any)(s);
  const Y = computeYLengthFeet(s);
  if (!Y || Y === 0 || !sorted || sorted.length < 3) return null;
  const hi = sorted[2],
    mid = sorted[1];
  const raw =
    (waterTableElevationFt(hi) - waterTableElevationFt(mid)) / Y;
  return Math.round(raw * 1e4) / 1e4;
}

export function intersectRayWithLine(origin: Pt, dir: Pt, c: Pt, d: Pt) {
  const vx = dir.x,
    vy = dir.y;
  const wx = d.x - c.x,
    wy = d.y - c.y;
  const denom = vx * wy - vy * wx;
  if (Math.abs(denom) < 1e-8)
    return { hit: null, tRay: Infinity, tLine: Infinity };
  const dx = c.x - origin.x,
    dy = c.y - origin.y;
  const tRay = (dx * wy - dy * wx) / denom;
  const tLine = (dx * vy - dy * vx) / denom;
  const hit = { x: origin.x + tRay * vx, y: origin.y + tRay * vy };
  return { hit, tRay, tLine };
}
export function isPointOnSegment(p: Pt, a: Pt, b: Pt, eps = 1e-6) {
  const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  if (Math.abs(cross) > eps) return false;
  const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
  if (dot < -eps) return false;
  const len2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (dot - len2 > eps) return false;
  return true;
}
export function rightAngleTicks(foot: Pt, along1: Pt, along2: Pt, size = 12) {
  const n1 = Math.hypot(along1.x, along1.y) || 1;
  const n2 = Math.hypot(along2.x, along2.y) || 1;
  const a = {
    x: foot.x + (along1.x / n1) * size,
    y: foot.y + (along1.y / n1) * size,
  };
  const b = {
    x: foot.x + (along2.x / n2) * size,
    y: foot.y + (along2.y / n2) * size,
  };
  return [a, foot, b] as [Pt, Pt, Pt];
}

export function pickHydraulicPropsForHighWell(s: RootState) {
  const sorted = (selectSortedByElevation as any)(s);
  if (!sorted || sorted.length < 3) return {};
  const hi = sorted[2];
  const wellDepth =
    (hi.GroundElevationFt ?? 0) - waterTableElevationFt(hi);
  const any: any = hi;
  if (Array.isArray(any.Geology) && any.Geology.length) {
    const geology = any.Geology;
    const target = geology.find(
      (g: any) =>
        typeof g.DepthStart === "function" &&
        typeof g.DepthEnd === "function" &&
        wellDepth >= g.DepthStart() &&
        wellDepth <= g.DepthEnd(),
    );
    if (!target) return {};
    const startIdx = geology.indexOf(target);
    let conductRow = target;
    for (let i = startIdx; i < geology.length; i++) {
      const gi = geology[i];
      if (gi.Conductivity() > conductRow.Conductivity()) conductRow = gi;
    }
    const conductivity = conductRow.Conductivity();
    const porosityFrac = Number((conductRow.Porosity() / 100).toFixed(2));
    return { conductivity, porosityFrac };
  }
  if (Array.isArray(hi.GeologyNew) && hi.GeologyNew.length) {
    const rows = [...hi.GeologyNew]
      .filter((r) => typeof r.depthFt === "number")
      .sort((a, b) => a.depthFt - b.depthFt);
    let idx = rows.findIndex((r, i) => {
      const nx = rows[i + 1];
      if (!nx) return wellDepth >= r.depthFt;
      return wellDepth >= r.depthFt && wellDepth <= nx.depthFt;
    });
    if (idx < 0) idx = 0;
    let maxIdx = idx;
    for (let i = idx; i < rows.length; i++) {
      const kMax = rows[maxIdx].conductivityK ?? Number.NEGATIVE_INFINITY;
      const kCur = rows[i].conductivityK ?? Number.NEGATIVE_INFINITY;
      if (kCur > kMax) maxIdx = i;
    }
    const conductivity = rows[maxIdx].conductivityK;
    const porosityFrac =
      rows[maxIdx].porosityPct != null
        ? Number((rows[maxIdx].porosityPct / 100).toFixed(2))
        : undefined;
    return { conductivity, porosityFrac };
  }
  return {};
}
