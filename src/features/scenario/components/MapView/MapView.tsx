import { Box } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { selectMap, selectWells } from "../../ScenarioSlice";
import WellMarker from "./WellMarker";
import MapOverlay from "./MapOverlay";

export default function MapView() {
  const map = useAppSelector(selectMap);
  const wells = useAppSelector(selectWells);
  return (
    <Box
      id="mapcontent"
      sx={{
        position: "relative",
        width: map?.width || 800,
        height: map?.height || 600,
        backgroundImage: map?.url ? `url(${map.url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {wells.map((w) => (
        <WellMarker key={w.id} wellId={w.id} />
      ))}
      <MapOverlay />
    </Box>
  );
}
