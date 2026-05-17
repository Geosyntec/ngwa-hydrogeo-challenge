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
import { computeYLengthFeet } from "../../../services/drawingMath";
import RealityCheck from "../../RealityCheck/RealityCheck";
import { panelBindTextFieldSx } from "../panelBindTextFieldSx";
import { PanelAccordionIcon } from "../PanelAccordionIcon";
import { useCallback, useEffect, useState } from "react";
import { store } from "../../../../../app/store";

export default function GradientPanel() {
  const dispatch = useAppDispatch();
  const g = useAppSelector(selectGradient);
  const sorted = useAppSelector(selectSortedByElevation);
  const ready = sorted.length === 3;
  const flowReady = useAppSelector(selectFlowAllStepsComplete);
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
        helperText={
          f.showAnswer ? `${f.answer}` :
            f.checked && !isTest
              ? f.isCorrect
                ?"✅"
                :"❌"
              : helper != null && helper !== ""
                  ? helper
                  : "\u00a0"
        }
        InputLabelProps={{ shrink: true }}
        sx={panelBindTextFieldSx(width ?? 280, !!f.showAnswer)}
      />
    );
  };
  const [rcOpen, setRcOpen] = useState(false);
  const [distanceYRevealed, setDistanceYRevealed] = useState(false);

  useEffect(() => {
    if (!g.WhatIsDistanceYValue.input && !g.WhatIsDistanceYValue.checked) {
      setDistanceYRevealed(false);
    }
  }, [g.WhatIsDistanceYValue.input, g.WhatIsDistanceYValue.checked]);

  const handleRevealDistanceY = () => {
    const Y = computeYLengthFeet(store.getState());
    if (Y != null) {
      dispatch(setField({ key: "WhatIsDistanceYValue", value: String(Y) }));
    }
    setDistanceYRevealed(true);
  };

  return (
    <Accordion
      disabled={!flowReady}
      expanded={selectedPanel === "gradient"}
      onChange={onToggle}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <PanelAccordionIcon panel="gradient" />
          <Typography variant="h5">Gradient</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{maxHeight:"300px",overflowY:"auto",minHeight:0}}>
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
                  <strong>Determine the distance 'Y':</strong> 
                  This step involves identifying distance ‘Y’. Distance Y is the measurement from the well with the highest water table elevation to the water table contour line. It follows the direction of groundwater flow, so it is always perpendicular to the water table contour line. Distance Y could be calculated using geometry, but to keep the modeling activity simple, distance Y is already provided.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {!distanceYRevealed ? (
                    <Button variant="outlined" onClick={handleRevealDistanceY}>
                      Reveal Distance Y
                    </Button>
                  ) : (
                    <>
                      <Grid container spacing={1}>
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
                    </>
                  )}
                </Box>
              </div>
              <div>
                <Typography variant="h6">Step 2</Typography>
                <Typography variant="body2" color="text.secondary">
                Use the formula below to compute the Gradient. Remember, use answers from previous steps where applicable. The final answer should be rounded to four decimal places (dp).
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid
                    item
                    xs={6}
                    columnSpacing={1}
                    sx={{ display: "flex", flexDirection: "row",flexWrap:"wrap" }}
                  >
                    <Grid item xs={4}>
                      {bind(
                        "HighestWaterTableValue",
                        "Elevation " + sorted[2].Name,
                        "",
                        100
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        paddingTop: "2%",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">-</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      {bind(
                        "RemainingWellValue",
                        "Elevation " + sorted[1].Name,
                        "",
                        100
                      )}
                    </Grid>
                    <Grid xs={12}>
                      <Box
                        sx={{
                          borderTop: (t) => `2px solid ${t.palette.divider}`,
                          alignSelf: "stretch",
                          flexShrink: 0,
                          mt: 2,
                          mb: 2,
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {bind(
                        "WhatIsDistanceYValue2",
                        "Distance Y (ft)",
                        "",
                        120
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", flexDirection: "row",alignItems:"center" }}
                  >
                    <Grid
                      item
                      xs={2}
                      sx={{
                        display: "flex",
                        paddingTop: "2%",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">=</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      {bind("Gradient", "Gradient (4 dp)", "", 150)}
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
          {/*Disabling reality checks for now  */}
          {false && (
            <RealityCheck
              title="Reality Check: Gradient"
              open={rcOpen}
              onToggleDisplay={() => setRcOpen((o) => !o)}
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
