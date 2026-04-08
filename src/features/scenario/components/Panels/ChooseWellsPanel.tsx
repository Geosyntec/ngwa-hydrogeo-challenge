import {
  Accordion,
  AccordionSummary,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  clearWell,
  selectSelectedWellIds,
  selectWells,
} from "../../ScenarioSlice";
import { dispatchResetChallenge } from "../../resetChallengeState";
import { PanelAccordionIcon } from "./PanelAccordionIcon";

export default function ChooseWellsPanel() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectSelectedWellIds);
  const wells = useAppSelector(selectWells);
  const nameOf = (id: string | null) =>
    wells.find((w) => w.id === id)?.Name ?? "";
  const Slot = ({ n, id }: { n: 1 | 2 | 3; id: string | null }) => {
    const label = id ? nameOf(id) : String(n);
    const color = id ? "primary" : "default";
    return (
      <Chip
        label={label}
        color={color as any}
        onDelete={() => {
          if (id) {
            dispatch(clearWell(n));
            dispatchResetChallenge(dispatch);
          }
        }}
        deleteIcon={id ? <BackspaceIcon /> : undefined}
        sx={{ fontWeight: id ? 700 : 400 }}
      />
    );
  };
  return (
    <Accordion>
      <AccordionSummary>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", width: "100%" }}
        >
          <PanelAccordionIcon panel="selectWells" />
          <Stack direction="row" spacing={2} flexGrow={1} alignItems="center">
            <Typography variant="h5">Choose 3 Wells</Typography>
            <Typography variant = "body2" sx={{fontSize:10}}>Click on any three <br/>well icons on the map</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Slot n={3} id={ids.three} />
            <Slot n={2} id={ids.two} />
            <Slot n={1} id={ids.one} />
          </Stack>
        </Stack>
      </AccordionSummary>
    </Accordion>
  );
}
