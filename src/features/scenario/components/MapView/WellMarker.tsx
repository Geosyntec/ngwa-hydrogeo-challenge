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
            onTogglePumping={(on) =>
              dispatch(setWellPumping({ id: well.id, on }))
            }
          />
        </Box>
      )}
    </>
  );
});
