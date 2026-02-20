import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { selectAllWellsChosen } from "../../../flowDirection/flowSlice";
import {
  runCheckStep1,
  runCheckStep2,
  runCheckStep3,
  selectFlow,
  selectFlowStep3Complete,
} from "../../../flowDirection/flowSelectors";
import { selectScenarioState, setSelectedPanel } from "../../../ScenarioSlice";
import { useEffect, useCallback, useState } from "react";
import FDStep1 from "./FD_Step1";
import FDStep2 from "./FD_Step2";
import FDStep3 from "./FD_Step3";
import RealityCheck from "../../RealityCheck/RealityCheck";

export default function FlowDirectionPanel() {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(selectAllWellsChosen);
  const flow = useAppSelector(selectFlow);
  const flowDone = useAppSelector(selectFlowStep3Complete);
  const { selectedPanel } = useAppSelector(selectScenarioState);
  const [rcOpen, setRcOpen] = useState(false);

  useEffect(() => {
    if (ready && selectedPanel !== "gradient" && selectedPanel !== "velocity") {
      dispatch(setSelectedPanel("flow"));
    }
  }, [ready, selectedPanel, dispatch]);

  useEffect(() => {
    console.log("flow done?:",flowDone)
    if (flowDone) {
      dispatch(setSelectedPanel("gradient"));
    }
  }, [flowDone, dispatch]);

  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "flow" : null));
    },
    [dispatch]
  );

  return (
    <Accordion
      disabled={!ready}
      expanded={selectedPanel === "flow"}
      onChange={onToggle}
      sx={{
        maxHeight: "20%",
        overflow:"scroll"
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Flow Direction</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {/* Host container for the slide-out: must be relative + overflow visible */}
        <Box sx={{ position: "relative", overflow: "visible" }}>
          {!ready && (
            <Typography variant="body2" color="text.secondary">
              Select three wells to begin this section.
            </Typography>
          )}
          {ready && (
            <Stack spacing={2}>
              <FDStep1 />
              <Divider />
              <FDStep2 />
              <Divider />
              <FDStep3 />
              <Typography variant="caption" color="text.secondary">
                Right: {flow.rightAnswers} &nbsp; Wrong: {flow.wrongAnswers}
              </Typography>
            </Stack>
          )}

          {/* Reality Check slide-out (visible when panel expanded) */}
          <RealityCheck
            title="Reality Check: Flow Direction"
            open={rcOpen}
            onToggle={() => setRcOpen((o) => !o)}
            available={selectedPanel === "flow"}
          >
            {/* You can paste/extend the legacy text here. The snippet below summarizes the first block. */}
            <Typography paragraph>
              The water table marks the top of the saturated zone.
              Hydrogeologists use water‑table elevations to determine
              groundwater flow, which moves from higher to lower water‑table
              elevations and is perpendicular to water‑table contours.{" "}
              {/* mirrors content under the Flow Direction reality‑check in scenario.html */}{" "}
              [1](https://geosyntec-my.sharepoint.com/personal/aang_geosyntec_com/Documents/Microsoft%20Copilot%20Chat%20Files/scenario.html)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tip: pumping near a well locally lowers the water table and can
              bend contours—your flow line should stay perpendicular to the
              contour through the middle well.
            </Typography>
          </RealityCheck>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
