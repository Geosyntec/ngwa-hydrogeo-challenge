import { memo, useCallback, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectWellById,
  selectAllWellsSelected,
  selectScenarioState,
  selectWell,
  setWellPumping,
} from "../../ScenarioSlice";
import WellInfoCard from "./WellInfoCard";

export default memo(function WellMarker({ wellId }: { wellId: string }) {
  console.log("rendering well popover: ",wellId)
  const dispatch = useAppDispatch();
  const well = useAppSelector(selectWellById(wellId));
  const allSelected = useAppSelector(selectAllWellsSelected);
  const { allowPumping, isTest } = useAppSelector(selectScenarioState);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const markerRef = useRef<HTMLButtonElement | null>(null);

  if (!well) return null;
  const isVisible = !allSelected || (allSelected && well.IsSelected);

  const handleSelect = useCallback(
    () => dispatch(selectWell(well.id)),
    [dispatch, well?.id],
  );

  // The card is “rendered” for selected wells, but only visible if hovered/focused.
  const showCard = !!well.IsSelected && (hover || focus);

  return (
    <>
      {isVisible && (
        <Box
          sx={{
            position: "absolute",
            top: well.Top,
            left: well.Left,
            transform: "translate(-50%, -100%)",
            display: "flex",
            alignItems: "center",
            gap: 1,
            // Ensure this container lets the card overlap outside
            overflow: "visible",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Button
            ref={markerRef}
            variant={well.IsSelected ? "contained" : "outlined"}
            color={well.IsSelected ? "primary" : "inherit"}
            size="small"
            onClick={handleSelect}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            sx={{ minWidth: 0, p: 0.5, borderRadius: 2 }}
            aria-label={`Well ${well.Name}`}
            title={`Well ${well.Name}`}
          >
            <RoomIcon fontSize="small" />
          </Button>
          <Box component="span" sx={{ fontWeight: 600, userSelect: "none" }}>
            {well.Name}
          </Box>

          {/* Non-modal, anchored info card (rendered for selected wells) */}
          {!!well.IsSelected && (
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
              // anchor near marker's position (use same top/left base in this container)
              top={0} // local (relative to this wrapper)
              left={0} // local (relative to this wrapper)
              open={showCard}
              onTogglePumping={(on) =>
                dispatch(setWellPumping({ id: well.id, on }))
              }
            />
          )}
        </Box>
      )}
    </>
  );
});
