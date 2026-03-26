import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  compassDegreesFromInternal,
  internalDegreesFromCompass,
  setDirectionAngle,
} from "../../../flowDirection/flowSlice";
import { selectFlow } from "../../../flowDirection/flowSelectors";
import { unitVectorFromRaphaelAngle } from "../../../services/drawingMath";

export default function CompassSelector({ display = true }: { display?: boolean }) {
  const size = 150;
  const dispatch = useAppDispatch();
  const { DirectionAngle } = useAppSelector(selectFlow);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cx = size / 2,
    cy = size / 2,
    ringR = Math.max(0, size / 2 - 15),
    handleR = 8;
  const handle = useMemo(() => {
    const v = unitVectorFromRaphaelAngle(DirectionAngle);
    return { x: cx + v.x * ringR, y: cy + v.y * ringR };
  }, [DirectionAngle, cx, cy, ringR]);
  const pointerToAngle = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return DirectionAngle;
      const rect = svgRef.current.getBoundingClientRect();
      const x = clientX - rect.left,
        y = clientY - rect.top;
      const ang = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
      return (ang + 360) % 360;
    },
    [cx, cy, DirectionAngle],
  );
  const setAngle = useCallback(
    (a: number, snap = false) => {
      let angle = (a + 360) % 360;
      if (snap) angle = Math.round(angle / 5) * 5;
      dispatch(setDirectionAngle(angle));
    },
    [dispatch],
  );
  const onPointerDown = useCallback(
    (e: React.PointerEvent<any>) => {
      (e.currentTarget as Element).setPointerCapture?.((e as any).pointerId);
      setDragging(true);
      setAngle(pointerToAngle(e.clientX, e.clientY), e.altKey || e.metaKey);
    },
    [pointerToAngle, setAngle],
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      setAngle(pointerToAngle(e.clientX, e.clientY), e.altKey || e.metaKey);
    },
    [dragging, pointerToAngle, setAngle],
  );
  const onPointerUp = useCallback(() => setDragging(false), []);
  useEffect(() => {
    const prev = document.body.style.userSelect;
    if (dragging) document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = prev;
    };
  }, [dragging]);
  /** Major ticks every 30° on the compass dial (0° = N, 90° = E, …). */
  const majorTicksCompass = Array.from({ length: 12 }, (_, i) => i * 30);
  const majorTicksInternal = majorTicksCompass.map(internalDegreesFromCompass);
  const toXYInternal = (internalDeg: number, r: number) => {
    const v = unitVectorFromRaphaelAngle(internalDeg);
    return { x: cx + v.x * r, y: cy + v.y * r };
  };
  if(!display) return null
  return (
    <Box sx={{ display: "inline-block", touchAction: "none" }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(compassDegreesFromInternal(DirectionAngle))}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="#d7d7d7"
          strokeWidth={18}
          onPointerDown={onPointerDown}
        />
        {majorTicksInternal.map((internalDeg, i) => {
          const p1 = toXYInternal(internalDeg, ringR - 12),
            p2 = toXYInternal(internalDeg, ringR + 12);
          return (
            <line
              key={majorTicksCompass[i]}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#999"
              strokeWidth={2}
            />
          );
        })}
        <text
          x={toXYInternal(internalDegreesFromCompass(90), ringR + 24).x}
          y={toXYInternal(internalDegreesFromCompass(90), ringR + 24).y}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
          dominantBaseline="middle"
        >
          E
        </text>
        <text
          x={toXYInternal(internalDegreesFromCompass(180), ringR + 24).x}
          y={toXYInternal(internalDegreesFromCompass(180), ringR + 24).y}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
          dominantBaseline="middle"
        >
          S
        </text>
        <text
          x={toXYInternal(internalDegreesFromCompass(270), ringR + 24).x}
          y={toXYInternal(internalDegreesFromCompass(270), ringR + 24).y}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
          dominantBaseline="middle"
        >
          W
        </text>
        <text
          x={toXYInternal(internalDegreesFromCompass(0), ringR + 24).x}
          y={toXYInternal(internalDegreesFromCompass(0), ringR + 24).y}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
          dominantBaseline="middle"
        >
          N
        </text>
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize={18}
          fontWeight={600}
          fill="#1976d2"
        >
          {Math.round(compassDegreesFromInternal(DirectionAngle))}°
        </text>
        <circle
          cx={handle.x}
          cy={handle.y}
          r={handleR}
          fill="#6CB5F4"
          stroke="white"
          strokeWidth={2}
          onPointerDown={onPointerDown}
        />
      </svg>
      <Box
        sx={{
          textAlign: "center",
          fontSize: 12,
          color: "text.secondary",
          mt: 1,
        }}
      >
        Degrees clockwise from North (legacy). Drag the blue dot (Alt/Option to
        snap 5°).
      </Box>
    </Box>
  );
}
