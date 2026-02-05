import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectGradient,
  setField,
  checkStep1,
  checkStep2,
  selectGradientStep2Complete,
} from "../../../gradient/gradientSlice";
import {
  selectSortedByElevation,
  selectFlowStep3Complete,
} from "../../../flowDirection/flowSlice";
import { selectScenarioState, setSelectedPanel } from "../../../ScenarioSlice";
import { useCallback, useEffect } from "react";

export default function GradientPanel() {
  const dispatch = useAppDispatch();
  const g = useAppSelector(selectGradient);
  const sorted = useAppSelector(selectSortedByElevation);
  const ready = sorted.length === 3;
  const flowReady = useAppSelector(selectFlowStep3Complete);
  const gradDone = useAppSelector(selectGradientStep2Complete);
  const { selectedPanel } = useAppSelector(selectScenarioState);
  const hi = ready ? sorted[2].Elevation : 0;
  const mid = ready ? sorted[1].Elevation : 0;
  useEffect(() => {
    if (gradDone) {
      dispatch(setSelectedPanel("velocity"));
    }
  }, [gradDone, dispatch]);
  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "gradient" : null));
    },
    [dispatch],
  );
  const bind = (
    key: keyof ReturnType<typeof selectGradient>,
    label: string,
    helper?: string,
  ) => {
    const f: any = (g as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        onChange={(e) => dispatch(setField({ key, value: e.target.value }))}
        error={f.checked && !f.isCorrect}
        helperText={f.showAnswer ? `Answer: ${f.answer}` : helper}
        sx={{ width: 280 }}
      />
    );
  };
  return (
    <Accordion
      defaultExpanded
      disabled={!flowReady}
      expanded={selectedPanel === "gradient"}
      onChange={onToggle}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Gradient</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {!flowReady && (
          <Typography variant="body2" color="text.secondary">
            Complete <strong>Flow Direction – Step 3</strong> to unlock
            Gradient.
          </Typography>
        )}
        {flowReady && ready && (
          <Stack spacing={3}>
            <div>
              <Typography variant="h6">Step 1</Typography>
              <Typography variant="body2" color="text.secondary">
                Determine <strong>Y</strong> (ft) using the contour geometry.
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  {bind("WhatIsDistanceYValue", "What is distance Y (ft)?")}
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(
                      checkStep1({
                        s: (window as any).store?.getState?.() ?? ({} as any),
                        check: true,
                      }),
                    )
                  }
                >
                  Check Step 1
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(
                      checkStep1({
                        s: (window as any).store?.getState?.() ?? ({} as any),
                        show: true,
                      }),
                    )
                  }
                >
                  Show Step 1 Solution
                </Button>
              </Stack>
            </div>
            <div>
              <Typography variant="h6">Step 2</Typography>
              <Typography variant="body2" color="text.secondary">
                Verify elevations, Y, and compute the <strong>Gradient</strong>{" "}
                (4 dp).
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  {bind("HighestWaterTableValue", "Highest elevation (ft)")}
                </Grid>
                <Grid item xs={12} md={6}>
                  {bind("RemainingWellValue", "Middle elevation (ft)")}
                </Grid>
                <Grid item xs={12} md={6}>
                  {bind("WhatIsDistanceYValue2", "Distance Y (ft)")}
                </Grid>
                <Grid item xs={12} md={6}>
                  {bind("Gradient", "Gradient (4 dp)")}
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(
                      checkStep2({
                        s: (window as any).store?.getState?.() ?? ({} as any),
                        hi,
                        mid,
                        check: true,
                      }),
                    )
                  }
                >
                  Check Step 2
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(
                      checkStep2({
                        s: (window as any).store?.getState?.() ?? ({} as any),
                        hi,
                        mid,
                        show: true,
                      }),
                    )
                  }
                >
                  Show Step 2 Solution
                </Button>
              </Stack>
            </div>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
