import { useMemo, useState } from "react";
import { Box, IconButton } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useAppSelector } from "../../../../app/hooks";
import { selectMap, selectWells, selectSelectedWellIds, selectAllWellsSelected } from "../../ScenarioSlice";
import type { WellModel } from "../../scenarioTypes";
import type { WellInfoCardPlacement } from "./WellInfoCard";
import WellMarker from "./WellMarker";
import MapOverlay from "./MapOverlay";
import ScenarioInfoModal from "./ScenarioInfoModal";
import { resolvePublicAssetUrl } from "../../../../utils/publicAssetUrl";

/**
 * Compute card placement for each selected well so popovers stay visible and don't overlap.
 * Mirrors legacy scenario.js: sort selected wells by Y; topmost → above, bottommost → below,
 * middle → left or right depending on whether its X is left of both others.
 */
function useWellCardPlacements(): Record<string, WellInfoCardPlacement> {
  const wells = useAppSelector(selectWells);
  const selected = useAppSelector(selectSelectedWellIds);
  const allSelected = useAppSelector(selectAllWellsSelected);

  return useMemo(() => {
    if (!allSelected || !selected.one || !selected.two || !selected.three) return {};

    const ids = [selected.one, selected.two, selected.three];
    const selectedWells: WellModel[] = ids
      .map((id) => wells.find((w) => w.id === id))
      .filter((w): w is WellModel => !!w);

    if (selectedWells.length !== 3) return {};

    const byY = [...selectedWells].sort((a, b) => a.Top - b.Top);
    const topmost = byY[0];
    const middle = byY[1];
    const bottommost = byY[2];

    const placement: Record<string, WellInfoCardPlacement> = {};
    placement[topmost.id] = "above";
    placement[bottommost.id] = bottommost.Top<500?"below":"above"; //avoid having wellInfoCard overflow vertically when the well is close to the bottom of the map
    const middleLeftOfBoth =
      middle.Left < topmost.Left && middle.Left < bottommost.Left;
    placement[middle.id] = middleLeftOfBoth ? "left" : "right";

    return placement;
  }, [allSelected, wells, selected.one, selected.two, selected.three]);
}

export default function MapView() {
  const map = useAppSelector(selectMap);
  const wells = useAppSelector(selectWells);
  const cardPlacements = useWellCardPlacements();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Box
      id="mapcontent"
      sx={{
        position: "relative",
        width: map?.width || 800,
        height: map?.height || 600,
        backgroundImage: map?.url
          ? `url(${resolvePublicAssetUrl(map.url)})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <IconButton
        aria-label="Scenario instructions"
        onClick={() => setInfoOpen(true)}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 20,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        <InfoOutlined fontSize="small" />
      </IconButton>
      <ScenarioInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
      <MapOverlay />
      {wells.map((w) => (
        <WellMarker
          key={w.id}
          wellId={w.id}
          cardPlacement={cardPlacements[w.id]}
        />
      ))}
    </Box>
  );
}
