import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectWellById,
  selectAllWellsSelected,
  selectScenarioState,
  selectWell,
  setWellPumping,
} from "../../ScenarioSlice";
import WellInfoCard, { type WellInfoCardPlacement } from "./WellInfoCard";

export default memo(function WellMarker({
  wellId,
  cardPlacement,
}: {
  wellId: string;
  cardPlacement?: WellInfoCardPlacement;
}) {
  const dispatch = useAppDispatch();
  const well = useAppSelector(selectWellById(wellId));
  const allSelected = useAppSelector(selectAllWellsSelected);
  const { allowPumping, isTest } = useAppSelector(selectScenarioState);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const markerRef = useRef<HTMLButtonElement | null>(null);
  const markerAnchorRef = useRef<HTMLDivElement | null>(null);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHoverLeave = useCallback(() => {
    if (hoverLeaveTimerRef.current != null) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
  }, []);

  const scheduleHoverLeave = useCallback(() => {
    cancelHoverLeave();
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHover(false);
      hoverLeaveTimerRef.current = null;
    }, 200);
  }, [cancelHoverLeave]);

  const beginHover = useCallback(() => {
    cancelHoverLeave();
    setHover(true);
  }, [cancelHoverLeave]);

  useEffect(
    () => () => {
      if (hoverLeaveTimerRef.current != null) clearTimeout(hoverLeaveTimerRef.current);
    },
    [],
  );

  if (!well) return null;
  const isVisible = !allSelected || (allSelected && well.IsSelected);

  const handleSelect = useCallback(
    () => dispatch(selectWell(well.id)),
    [dispatch, well?.id],
  );

  const showCard = well.IsSelected || hover || focus;

  return (
    <>
      {isVisible && (
        <Box
          ref={markerAnchorRef}
          sx={{
            position: "absolute",
            top: well.Top,
            left: well.Left,
            zIndex: 1,
            // Center symbol on map coordinates (legacy-style disc marker, not pin tip)
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "visible",
          }}
          onMouseEnter={beginHover}
          onMouseLeave={scheduleHoverLeave}
        >
          <Button
            ref={markerRef}
            disableRipple
            onClick={handleSelect}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            aria-label={`Well ${well.Name}`}
            title={`Well ${well.Name}`}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              p: 0,
              borderRadius: "50%",
              fontSize: "1rem",
              fontWeight: 700,
              lineHeight: 1,
              color: "common.white",
              textTransform: "none",
              bgcolor: "primary.main",
              border: (theme) =>
                `2px solid ${
                  well.IsSelected
                    ? theme.palette.common.white
                    : theme.palette.primary.dark
                }`,
              boxShadow: well.IsSelected ? 3 : 1,
              "&:hover": {
                bgcolor: "primary.dark",
                borderColor: "common.white",
              },
            }}
          >
            {well.Name}
          </Button>

          {/* Non-modal, anchored info card (rendered for selected wells) */}
          <WellInfoCard
            well={{
              Name: well.Name,
              GroundElevationFt: well.GroundElevationFt,
              StaticElevationFt: well.StaticElevationFt,
              PumpingElevationFt: well.PumpingElevationFt,
              IsPumpingOn: well.IsPumpingOn,
              GeologyNew: (well as any).GeologyNew ?? [],
            }}
            allowPumping={allowPumping}
            isTest={isTest}
            top={0}
            left={0}
            open={showCard}
            placement={cardPlacement}
            anchorRef={markerAnchorRef}
            portalPointerHandlers={{
              onMouseEnter: beginHover,
              onMouseLeave: scheduleHoverLeave,
            }}
            onTogglePumping={(on) =>
              dispatch(setWellPumping({ id: well.id, on }))
            }
          />
        </Box>
      )}
    </>
  );
});
