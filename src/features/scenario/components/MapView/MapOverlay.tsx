import { memo, useMemo } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { selectMap } from "../../ScenarioSlice";
import {
  selectFlow,
  selectSortedByElevation,
} from "../../flowDirection/flowSlice";
import { selectGradient } from "../../gradient/gradientSlice";
import {
  distance as distPx,
  pointOnLine,
  findPerpPoint,
  findIntersectionPoint,
  unitVectorFromRaphaelAngle,
  intersectRayWithLine,
  isPointOnSegment,
  rightAngleTicks,
} from "../../services/drawingMath";

export default memo(function MapOverlay() {
  const map = useAppSelector(selectMap);
  const flow = useAppSelector(selectFlow);
  const g = useAppSelector(selectGradient);
  const sorted = useAppSelector(selectSortedByElevation);
  if (!map || sorted.length < 3) return null;
  const { width, height, physicalWidth } = map;
  const ratioFtPerPx = (physicalWidth * 5280) / width;
  const lo = sorted[0],
    mid = sorted[1],
    hi = sorted[2];

  const geom = useMemo(() => {
    const dHM_Ft = Math.round(distPx(hi.Point, mid.Point) * ratioFtPerPx);
    const dML_Ft = Math.round(distPx(mid.Point, lo.Point) * ratioFtPerPx);
    const dLH_Ft = Math.round(distPx(lo.Point, hi.Point) * ratioFtPerPx);

    const diffHighLow = Math.round((hi.Elevation - lo.Elevation) * 10) / 10;
    const diffHighMid = Math.round((hi.Elevation - mid.Elevation) * 10) / 10;
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

    const step2Engaged =
      !!flow.ElevResult_X_DistanceHighMid.input ||
      !!flow.ElevResult_X_DistanceHighMid.answer ||
      !!flow.DistanceHighestLowest.input ||
      !!flow.DistanceHighestLowest.answer;
    const step3Engaged =
      !!flow.SelectedDirection.input || !!flow.SelectedDirection.answer;
    const step1YEngaged =
      !!g.WhatIsDistanceYValue.input || !!g.WhatIsDistanceYValue.answer;

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
      if (hit && tRay > 0 && isPointOnSegment(hit, mid.Point, intersection))
        lenPx = distPx(hi.Point, hit) + 80;
      const end = {
        x: hi.Point.x + dir.x * lenPx,
        y: hi.Point.y + dir.y * lenPx,
      };
      userLine = { end };
    }

    return {
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
    };
  }, [hi, mid, lo, ratioFtPerPx, flow, g]);

  const ticks = useMemo(() => {
    const alongContour = {
      x: geom.intersection.x - mid.Point.x,
      y: geom.intersection.y - mid.Point.y,
    };
    const alongPerp = {
      x: geom.foot.x - hi.Point.x,
      y: geom.foot.y - hi.Point.y,
    };
    return rightAngleTicks(geom.foot, alongContour, alongPerp, 12);
  }, [geom, mid, hi]);

  const showY = geom.step1YEngaged || geom.step2Engaged;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <marker
          id="arrowBoth"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M10 5 L0 0 L0 10 z" fill="#333" />
        </marker>
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
      <LineWithLabel
        a={hi.Point}
        b={mid.Point}
        color="#666"
        width={2}
        bothArrows
        label={`${geom.dHM_Ft.toLocaleString()} ft.`}
      />
      <LineWithLabel
        a={mid.Point}
        b={lo.Point}
        color="#666"
        width={2}
        bothArrows
        label={`${geom.dML_Ft.toLocaleString()} ft.`}
      />
      <LineWithLabel
        a={lo.Point}
        b={hi.Point}
        color="#666"
        width={2}
        bothArrows
        label={`${geom.dLH_Ft.toLocaleString()} ft.`}
      />

      {geom.step2Engaged && (
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
            x2={geom.intersection.x}
            y2={geom.intersection.y}
            stroke="#998675"
            strokeWidth={7}
            opacity={0.9}
          />
        </>
      )}

      {showY && (
        <>
          <line
            x1={hi.Point.x}
            y1={hi.Point.y}
            x2={geom.foot.x}
            y2={geom.foot.y}
            stroke="red"
            strokeWidth={3}
          />
          <text
            x={(hi.Point.x + geom.foot.x) / 2}
            y={(hi.Point.y + geom.foot.y) / 2 - 8}
            fontSize={12}
            fill="red"
            textAnchor="middle"
          >
            Y
          </text>
          <text
            x={(hi.Point.x + geom.foot.x) / 2}
            y={(hi.Point.y + geom.foot.y) / 2 + 12}
            fontSize={12}
            fill="#6CB5F4"
            textAnchor="middle"
          >
            {geom.yLen_Ft.toLocaleString()} ft.
          </text>
          {!geom.actualOnSegment && (
            <ExtendedLine
              a={mid.Point}
              b={geom.intersection}
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

      {geom.step3Engaged && (
        <line
          x1={hi.Point.x}
          y1={hi.Point.y}
          x2={geom.foot.x}
          y2={geom.foot.y}
          stroke="#0071BC"
          strokeWidth={4}
          strokeDasharray="6 6"
          markerEnd="url(#arrowEndBlue)"
        />
      )}
      {geom.step3Engaged && geom.userLine && (
        <line
          x1={hi.Point.x}
          y1={hi.Point.y}
          x2={geom.userLine.end.x}
          y2={geom.userLine.end.y}
          stroke="#2e7d32"
          strokeWidth={4}
          strokeDasharray="6 6"
          markerEnd="url(#arrowEndGreen)"
        />
      )}
    </svg>
  );
});

function LineWithLabel({
  a,
  b,
  label,
  color = "#333",
  width = 2,
  bothArrows = false,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  label: string;
  color?: string;
  width?: number;
  bothArrows?: boolean;
}) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const marker = bothArrows ? "url(#arrowBoth)" : undefined;
  return (
    <>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={color}
        strokeWidth={width}
        markerStart={marker}
        markerEnd={marker}
      />
      <text
        x={mid.x}
        y={mid.y - 6}
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
