import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectGradient,
  checkStep1,
  checkStep2,
  selectGradientStep2Complete,
} from "../../../gradient/gradientSelectors";
import { GradientState, setField } from "../../../gradient/gradientSlice";
import {
  selectSortedByElevation,
  waterTableElevationFt,
} from "../../../flowDirection/flowSlice";
import { selectFlowAllStepsComplete } from "../../../flowDirection/flowSelectors";
import { selectScenarioState, setSelectedPanel } from "../../../ScenarioSlice";
import RealityCheck from "../../RealityCheck/RealityCheck";
import { useCallback, useEffect, useState } from "react";

export default function GradientPanel() {
  const dispatch = useAppDispatch();
  const g = useAppSelector(selectGradient);
  const sorted = useAppSelector(selectSortedByElevation);
  const ready = sorted.length === 3;
  const flowReady = useAppSelector(selectFlowAllStepsComplete);
  const gradDone = useAppSelector(selectGradientStep2Complete);
  const { selectedPanel, isTest } = useAppSelector(selectScenarioState);
  const hi = ready ? waterTableElevationFt(sorted[2]) : 0;
  const mid = ready ? waterTableElevationFt(sorted[1]) : 0;
  // useEffect(() => {
  //   console.log("flow ready?: ",flowReady)
  //   console.log("current panel?: ",selectedPanel)
  //   if (flowReady && selectedPanel == "flow") {
  //     dispatch(setSelectedPanel("gradient"));
  //   }
  // }, [flowReady, dispatch]);

  // useEffect(() => {
  //   if (gradDone) {
  //     dispatch(setSelectedPanel("velocity"));
  //   }
  // }, [gradDone, dispatch]);
  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "gradient" : null));
    },
    [dispatch]
  );
  const bind = (
    key: keyof GradientState,
    label: string,
    helper?: string,
    width?: number
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
        sx={{ width: width ?? 280 }}
      />
    );
  };
  const [rcOpen, setRcOpen] = useState(false);

  return (
    <Accordion
      disabled={!flowReady}
      expanded={selectedPanel === "gradient"}
      onChange={onToggle}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Gradient</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ position: "relative", overflow: "visible" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: "12px" }}
          >
            To determine the Gradient along the Flow Direction you will need to
            work through two steps.
          </Typography>
          {flowReady && ready && (
            <Stack spacing={3}>
              <div>
                <Typography variant="h6">Step 1</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Determine the distance 'Y':</strong> Distance 'Y' is
                  the measurement between the well with the highest water table
                  elevation and the water table contour line. Distance 'Y' is
                  always perpendicaular to the water table contour line.
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    {bind("WhatIsDistanceYValue", "What is distance Y (ft)?")}
                  </Grid>
                </Grid>
                {!isTest && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        dispatch(
                          checkStep1({
                            show: false,
                            check: true,
                          })
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
                            check: true,
                            show: true,
                          })
                        )
                      }
                    >
                      Show Step 1 Solution
                    </Button>
                  </Stack>
                )}
              </div>
              <div>
                <Typography variant="h6">Step 2</Typography>
                <Typography variant="body2" color="text.secondary">
                  Verify elevations, Y, and compute the{" "}
                  <strong>Gradient</strong> (4 dp).
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid
                    item
                    lg={6}
                    columnSpacing={1}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <Grid item lg={4}>
                      {bind(
                        "HighestWaterTableValue",
                        "Highest elevation (ft)",
                        "",
                        100
                      )}
                    </Grid>
                    <Grid item lg={4} sx={{display:'flex',paddingTop:'2%',justifyContent:'center'}}>
                      <Typography variant="body2">-</Typography>
                    </Grid>
                    <Grid item lg={4}>
                      {bind(
                        "RemainingWellValue",
                        "Middle elevation (ft)",
                        "",
                        100
                      )}
                    </Grid>
                    <Grid item lg={12} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      {bind(
                        "WhatIsDistanceYValue2",
                        "Distance Y (ft)",
                        "",
                        100
                      )}
                    </Grid>
                  </Grid>
                  <Grid item lg={6} sx={{display:'flex',flexDirection:'row'}}>
                    <Grid item lg={2} sx={{display:'flex',paddingTop:'2%',justifyContent:'center'}}>
                      <Typography variant="body2">=</Typography>
                    </Grid>
                    <Grid item lg={10}>
                      {bind("Gradient", "Gradient (4 dp)","",100)}
                    </Grid>
                  </Grid>
                </Grid>
                {!isTest && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        dispatch(
                          checkStep2({
                            show: false,
                            check: true,
                          })
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
                            check: true,
                            show: true,
                          })
                        )
                      }
                    >
                      Show Step 2 Solution
                    </Button>
                  </Stack>
                )}
              </div>
            </Stack>
          )}

          {!isTest && (
            <RealityCheck
              title="Reality Check: Gradient"
              open={rcOpen}
              onToggle={() => setRcOpen((o) => !o)}
              available={selectedPanel === "gradient"}
            >
              <Typography paragraph>
                Think of gradient as the slope of the water table. In the
                challenge it’s treated as a straight, constant slope between
                points, but in reality it varies and the pumping cone depresses
                elevations near a well.{" "}
                {/* mirrors the Gradient reality‑check text from scenario.html */}{" "}
                [1](https://geosyntec-my.sharepoint.com/personal/aang_geosyntec_com/Documents/Microsoft%20Copilot%20Chat%20Files/scenario.html)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Distance “Y” is always measured perpendicular to the water‑table
                contour through the middle well.
              </Typography>
            </RealityCheck>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
