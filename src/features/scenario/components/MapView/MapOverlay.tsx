import React, { memo, useId, useMemo } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { selectMap } from "../../ScenarioSlice";
import {
  selectSortedByElevation,
  waterTableElevationFt,
} from "../../flowDirection/flowSlice";
import { selectFlow } from "../../flowDirection/flowSelectors";
import { selectGradient } from "../../gradient/gradientSelectors";
import {
  distance as distPx,
  pointOnLine,
  findPerpPoint,
  findIntersectionPoint,
  unitVectorFromRaphaelAngle,
  intersectRayWithLine,
  isPointOnSegment,
  rightAngleTicks,
  legacyMeasuredLineGeometry,
  type LegacyMeasuredLineGeom,
} from "../../services/drawingMath";

export default memo(function MapOverlay() {
  // ✅ Always call hooks in the same order on every render
  const map = useAppSelector(selectMap);
  const flow = useAppSelector(selectFlow);
  const g = useAppSelector(selectGradient);
  const sorted = useAppSelector(selectSortedByElevation);

  // ✅ Compute everything in a single memo; return `null` if not ready
  const computed = useMemo(() => {
    if (!map || !sorted || sorted.length < 3) return null;

    const { width, height, physicalWidth } = map;
    const lo = sorted[0],
      mid = sorted[1],
      hi = sorted[2];

    const ratioFtPerPx = (physicalWidth * 5280) / width;

    const dHM_Ft = Math.round(distPx(hi.Point, mid.Point) * ratioFtPerPx);
    const dML_Ft = Math.round(distPx(mid.Point, lo.Point) * ratioFtPerPx);
    const dLH_Ft = Math.round(distPx(lo.Point, hi.Point) * ratioFtPerPx);

    const hiEl = waterTableElevationFt(hi);
    const midEl = waterTableElevationFt(mid);
    const loEl = waterTableElevationFt(lo);
    const diffHighLow = Math.round((hiEl - loEl) * 10) / 10;
    const diffHighMid = Math.round((hiEl - midEl) * 10) / 10;
    const elevRatio =
      diffHighLow === 0 ? 0 : Number((diffHighMid / diffHighLow).toFixed(2));

    const dHL_Ft = dLH_Ft;
    const dToIntersection_Ft = Math.round(dHL_Ft * elevRatio);
    const dToIntersection_Px = dToIntersection_Ft / ratioFtPerPx;

    const intersection = pointOnLine(hi.Point, lo.Point, dToIntersection_Px);
    const foot = findPerpPoint(mid.Point, intersection, hi.Point);
    const yLen_Ft = Math.round(distPx(hi.Point, foot) * ratioFtPerPx);

    const actualFlowIntersection = findIntersectionPoint(
      mid.Point,
      intersection,
      hi.Point,
      foot,
    );
    const actualOnSegment = isPointOnSegment(
      actualFlowIntersection,
      mid.Point,
      intersection,
    );

    // UI engagement flags (same logic as before)
    const step2Engaged =
      !!flow.ElevResult_X_DistanceHighMid.input ||
      !!flow.ElevResult_X_DistanceHighMid.answer ||
      !!flow.DistanceHighestLowest.input ||
      !!flow.DistanceHighestLowest.answer;

    const step3Engaged =
      !!flow.SelectedDirection.input || !!flow.SelectedDirection.answer;
    const step1YEngaged =
      !!g.WhatIsDistanceYValue.input || !!g.WhatIsDistanceYValue.answer;

    // Optional user line for step 3
    let userLine: { end: { x: number; y: number } } | null = null;
    if (step3Engaged) {
      const angle =
        parseFloat(
          flow.SelectedDirection.input || String(flow.DirectionAngle) || "0",
        ) || 0;
      const dir = unitVectorFromRaphaelAngle(angle);
      const { hit, tRay } = intersectRayWithLine(
        hi.Point,
        dir,
        mid.Point,
        intersection,
      );
      let lenPx = 100;
      if (hit && tRay > 0 && isPointOnSegment(hit, mid.Point, intersection)) {
        lenPx = distPx(hi.Point, hit) + 80;
      }
      userLine = {
        end: { x: hi.Point.x + dir.x * lenPx, y: hi.Point.y + dir.y * lenPx },
      };
    }

    // Legacy DrawingHelper.drawMeasuredLine: offset sides + caps from each well
    const sideHM = legacyMeasuredLineGeometry(hi.Point, mid.Point, lo.Point);
    const sideML = legacyMeasuredLineGeometry(mid.Point, lo.Point, hi.Point);
    const sideLH = legacyMeasuredLineGeometry(lo.Point, hi.Point, mid.Point);

    return {
      // map dims
      width,
      height,
      // wells + ratio (used in render)
      hi,
      mid,
      lo,
      ratioFtPerPx,
      // geometry
      dHM_Ft,
      dML_Ft,
      dLH_Ft,
      intersection,
      foot,
      yLen_Ft,
      actualOnSegment,
      step2Engaged,
      step3Engaged,
      step1YEngaged,
      userLine,
      sideHM,
      sideML,
      sideLH,
    };
  }, [map, sorted, flow, g]);

  // ✅ Second memo also called unconditionally; safe to read from `computed`
  const ticks = useMemo(() => {
    if (!computed) return null;
    const alongContour = {
      x: computed.intersection.x - computed.mid.Point.x,
      y: computed.intersection.y - computed.mid.Point.y,
    };
    const alongPerp = {
      x: computed.foot.x - computed.hi.Point.x,
      y: computed.foot.y - computed.hi.Point.y,
    };
    return rightAngleTicks(computed.foot, alongContour, alongPerp, 12);
  }, [computed]);

  // If we’re not ready, render nothing (hooks still ran above, so no violation)
  if (!computed) return null;

  const { width, height, hi, mid, lo } = computed;
  const showY = computed.step1YEngaged || computed.step2Engaged;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <marker
          id="arrowEndBlue"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#0071BC" />
        </marker>
        <marker
          id="arrowEndGreen"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#2e7d32" />
        </marker>
      </defs>

      {/* side lengths (legacy: offset from wells + bounding caps from well locations) */}
      {computed.sideHM && (
        <LegacyMeasuredSide
          geom={computed.sideHM}
          color="#666"
          width={2}
          bothArrows
          label={`${computed.dHM_Ft.toLocaleString()} ft.`}
        />
      )}
      {computed.sideML && (
        <LegacyMeasuredSide
          geom={computed.sideML}
          color="#666"
          width={2}
          bothArrows
          label={`${computed.dML_Ft.toLocaleString()} ft.`}
        />
      )}
      {computed.sideLH && (
        <LegacyMeasuredSide
          geom={computed.sideLH}
          color="#666"
          width={2}
          bothArrows
          label={`${computed.dLH_Ft.toLocaleString()} ft.`}
        />
      )}

      {/* highlighted segments once step 2 is engaged */}
      {computed.step2Engaged && (
        <>
          <line
            x1={hi.Point.x}
            y1={hi.Point.y}
            x2={lo.Point.x}
            y2={lo.Point.y}
            stroke="#FBB03B"
            strokeWidth={7}
            opacity={0.9}
          />
          <line
            x1={mid.Point.x}
            y1={mid.Point.y}
            x2={computed.intersection.x}
            y2={computed.intersection.y}
            stroke="#998675"
            strokeWidth={7}
            opacity={0.9}
          />
        </>
      )}

      {/* Y distance */}
      {showY && (
        <>
          <line
            x1={hi.Point.x}
            y1={hi.Point.y}
            x2={computed.foot.x}
            y2={computed.foot.y}
            stroke="red"
            strokeWidth={3}
          />
          <text
            x={(hi.Point.x + computed.foot.x) / 2}
            y={(hi.Point.y + computed.foot.y) / 2 - 8}
            fontSize={12}
            fill="red"
            textAnchor="middle"
          >
            Y
          </text>
          <text
            x={(hi.Point.x + computed.foot.x) / 2}
            y={(hi.Point.y + computed.foot.y) / 2 + 12}
            fontSize={12}
            fill="#6CB5F4"
            textAnchor="middle"
          >
            {computed.yLen_Ft.toLocaleString()} ft.
          </text>
          {!computed.actualOnSegment && (
            <ExtendedLine
              a={mid.Point}
              b={computed.intersection}
              color="#998675"
              width={4}
              dash="6 6"
              opacity={0.6}
            />
          )}
          {ticks && (
            <>
              <line
                x1={ticks[1].x}
                y1={ticks[1].y}
                x2={ticks[0].x}
                y2={ticks[0].y}
                stroke="red"
                strokeWidth={3}
              />
              <line
                x1={ticks[1].x}
                y1={ticks[1].y}
                x2={ticks[2].x}
                y2={ticks[2].y}
                stroke="red"
                strokeWidth={3}
              />
            </>
          )}
        </>
      )}

      {/* actual vs user direction (step 3) */}
      {/* {computed.step3Engaged && (
        <line
          x1={hi.Point.x}
          y1={hi.Point.y}
          x2={computed.foot.x}
          y2={computed.foot.y}
          stroke="#0071BC"
          strokeWidth={4}
          strokeDasharray="6 6"
          markerEnd="url(#arrowEndBlue)"
        />
      )} */}
      {computed.step3Engaged && computed.userLine && (
        <line
          x1={hi.Point.x}
          y1={hi.Point.y}
          x2={computed.userLine.end.x}
          y2={computed.userLine.end.y}
          stroke="#0071BC"
          strokeWidth={4}
          strokeDasharray="6 6"
          markerEnd="url(#arrowEndBlue)"
        />
      )}
    </svg>
  );
});

/** Matches legacy `DrawingHelper.drawMeasuredLine` SVG output. */
function LegacyMeasuredSide({
  geom,
  label,
  color = "#666",
  width = 2,
  bothArrows = false,
}: {
  geom: LegacyMeasuredLineGeom;
  label: string;
  color?: string;
  width?: number;
  bothArrows?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const startId = `measSideArrowStart-${uid}`;
  const endId = `measSideArrowEnd-${uid}`;

  return (
    <>
      {bothArrows && (
        <defs>
          <marker
            id={startId}
            markerUnits="userSpaceOnUse"
            markerWidth="5"
            markerHeight="5"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            orient="auto-start-reverse"
          >
            <path d="M10 5 L0 0 L0 10 z" fill={color} />
          </marker>
          <marker
            id={endId}
            markerUnits="userSpaceOnUse"
            markerWidth="5"
            markerHeight="5"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            orient="auto"
          >
            <path d="M10 5 L0 0 L0 10 z" fill={color} />
          </marker>
        </defs>
      )}
      <line
        x1={geom.cap1Start.x}
        y1={geom.cap1Start.y}
        x2={geom.cap1End.x}
        y2={geom.cap1End.y}
        stroke={color}
        strokeWidth={width}
      />
      <line
        x1={geom.cap2Start.x}
        y1={geom.cap2Start.y}
        x2={geom.cap2End.x}
        y2={geom.cap2End.y}
        stroke={color}
        strokeWidth={width}
      />
      <line
        x1={geom.segmentStart.x}
        y1={geom.segmentStart.y}
        x2={geom.segmentEnd.x}
        y2={geom.segmentEnd.y}
        stroke={color}
        strokeWidth={width}
        markerStart={bothArrows ? `url(#${startId})` : undefined}
        markerEnd={bothArrows ? `url(#${endId})` : undefined}
      />
      <text
        x={geom.labelMid.x}
        y={geom.labelMid.y - 6}
        fontSize={12}
        fill="#333"
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
}

function ExtendedLine({
  a,
  b,
  color = "#998675",
  width = 4,
  dash = "6 6",
  opacity = 0.6,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  color?: string;
  width?: number;
  dash?: string;
  opacity?: number;
}) {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const n = Math.hypot(dx, dy) || 1;
  const ux = dx / n,
    uy = dy / n;
  const L = 2000;
  const p1 = { x: a.x - ux * L, y: a.y - uy * L },
    p2 = { x: b.x + ux * L, y: b.y + uy * L };
  return (
    <line
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
}
