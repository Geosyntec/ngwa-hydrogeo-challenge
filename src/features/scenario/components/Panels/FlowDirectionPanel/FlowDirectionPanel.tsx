import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectAllWellsChosen,
  runCheckStep1,
  runCheckStep2,
  runCheckStep3,
  selectFlow,
  selectFlowStep3Complete,
} from "../../../flowDirection/flowSlice";
import { selectScenarioState, setSelectedPanel } from "../../../ScenarioSlice";
import { useEffect, useCallback } from "react";
import FDStep1 from "./FD_Step1";
import FDStep2 from "./FD_Step2";
import FDStep3 from "./FD_Step3";

export default function FlowDirectionPanel() {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(selectAllWellsChosen);
  const flow = useAppSelector(selectFlow);
  const flowDone = useAppSelector(selectFlowStep3Complete);
  const { selectedPanel } = useAppSelector(selectScenarioState);

  useEffect(() => {
    if (flowDone) {
      dispatch(setSelectedPanel("gradient"));
    }
  }, [flowDone, dispatch]);
  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "flow" : null));
    },
    [dispatch],
  );

  return (
    <Accordion
      disabled={!ready}
      expanded={selectedPanel === "flow"}
      onChange={onToggle}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Flow Direction</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep1({ checkAnswers: true }))}
              >
                Check Step 1
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep1({ showAnswers: true }))}
              >
                Show Step 1 Solution
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep2({ checkAnswers: true }))}
              >
                Check Step 2
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep2({ showAnswers: true }))}
              >
                Show Step 2 Solution
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep3({ checkAnswers: true }))}
              >
                Check Step 3
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(runCheckStep3({ showAnswers: true }))}
              >
                Show Step 3 Solution
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Right: {flow.rightAnswers} &nbsp; Wrong: {flow.wrongAnswers}
            </Typography>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
