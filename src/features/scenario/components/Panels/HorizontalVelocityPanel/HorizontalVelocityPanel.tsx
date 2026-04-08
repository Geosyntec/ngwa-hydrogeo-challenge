import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectVelocity,
  checkStep1,
  checkStep2,
  selectVelocityStep2Complete,
  selectVelocityRightCount,
  VELOCITY_TOTAL_QUESTIONS,
} from "../../../velocity/velocitySelectors";
import { setField, VelocityState } from "../../../velocity/velocitySlice";
import { selectSortedByElevation } from "../../../flowDirection/flowSlice";
import {
  selectFlowAllStepsComplete,
  selectFlowRightCount,
  FLOW_TOTAL_QUESTIONS,
} from "../../../flowDirection/flowSelectors";
import {
  selectGradientStep2Complete,
  selectGradientRightCount,
  GRADIENT_TOTAL_QUESTIONS,
} from "../../../gradient/gradientSelectors";
import {
  selectScenarioState,
  setSelectedPanel,
  clearWell,
} from "../../../ScenarioSlice";
import { dispatchResetChallenge } from "../../../resetChallengeState";
import { selectIsAuthenticated } from "../../../../auth/authSlice";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RealityCheck from "../../RealityCheck/RealityCheck";
import SubmitResultsModal from "../SubmitResultsModal";
import { panelBindTextFieldSx } from "../panelBindTextFieldSx";
import { ROUTES } from "../../../../../app/routes";
import { store } from "../../../../../app/store";
import { buildSubmitGradesPayload } from "../../../submitGradesPayload";
import { submitGrades } from "../../../../../api/submitGradesApi";
import { PanelAccordionIcon } from "../PanelAccordionIcon";

export default function HorizontalVelocityPanel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const v = useAppSelector(selectVelocity);
  const sorted = useAppSelector(selectSortedByElevation);
  const gradReady = useAppSelector(selectGradientStep2Complete);
  const flowComplete = useAppSelector(selectFlowAllStepsComplete);
  const velocityComplete = useAppSelector(selectVelocityStep2Complete);
  const allPanelsComplete = flowComplete && gradReady && velocityComplete;
  const flowRight = useAppSelector(selectFlowRightCount);
  const gradientRight = useAppSelector(selectGradientRightCount);
  const velocityRight = useAppSelector(selectVelocityRightCount);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const { selectedPanel, isTest } = useAppSelector(selectScenarioState);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const showTestSubmit = isTest && !isAuthenticated;
  const ready = sorted.length === 3;
  // useEffect(() => {
  //   if (gradReady && selectedPanel !== "gradient") {
  //     dispatch(setSelectedPanel("gradient"));
  //   }
  // }, [gradReady, dispatch]);

  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "velocity" : null));
    },
    [dispatch]
  );
  const bind = (
    key: keyof VelocityState,
    label: string,
    helper?: string,
    width?: number
  ) => {
    const f: any = (v as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        onChange={(e) => dispatch(setField({ key, value: e.target.value }))}
        error={f.checked && !f.isCorrect}
        helperText={
          f.showAnswer ? `${f.answer}` : helper != null && helper !== ""
            ? helper
            : "\u00a0"
        }
        InputLabelProps={{ shrink: true }}
        sx={panelBindTextFieldSx(width ?? 50, !!f.showAnswer)}
      />
    );
  };
  const [rcOpen, setRcOpen] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testSubmitSuccessOpen, setTestSubmitSuccessOpen] = useState(false);
  const [testSubmitError, setTestSubmitError] = useState<string | null>(null);
  const handleTestSubmit = useCallback(async () => {
    setTestSubmitError(null);
    const payload = buildSubmitGradesPayload(store.getState());
    if (!payload) {
      setTestSubmitError(
        "Student ID is missing. Close the test and verify your identity again.",
      );
      return;
    }
    setTestSubmitting(true);
    try {
      await submitGrades(payload);
      setTestSubmitSuccessOpen(true);
    } catch (e) {
      setTestSubmitError(
        e instanceof Error ? e.message : "Failed to submit grades.",
      );
    } finally {
      setTestSubmitting(false);
    }
  }, []);

  return (
    <Accordion
      disabled={!gradReady}
      expanded={selectedPanel === "velocity"}
      onChange={onToggle}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <PanelAccordionIcon panel="horizontalVelocity" />
          <Typography variant="h5">Horizontal Velocity</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ position: "relative", overflow: "visible" }}>
          {gradReady && ready && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "12px" }}
              >
                Now that you have found the gradient you can calculate the
                groundwater's horizontal velocity (v). You need to complete 2
                steps to find this value.
              </Typography>
              <Stack spacing={3}>
                <div>
                  <Typography variant="h6">Step 1</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find these values:
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid
                      item
                      lg={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">i (gradient) = </Typography>
                      </Grid>
                      <Grid item lg={2}>
                        {bind("Gradient", "", "", 100)}
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">
                          ft/ft (round to 4 Decimal Places)
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      lg={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">
                          K (conductivity) ={" "}
                        </Typography>
                      </Grid>
                      <Grid item lg={2}>
                        {bind("Conductivity", "", "", 100)}
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">ft/day</Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      lg={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">n (porosity) = </Typography>
                      </Grid>
                      <Grid item lg={2}>
                        {bind("Porosity", "", "", 100)}
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2">
                          (Percentage expressed as a value from 0-1)
                        </Typography>
                      </Grid>
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
                    Use Darcy's Law to find the horizontal velocity of
                    groundwater between the wells:
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid
                      item
                      lg={6}
                      columnSpacing={1}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      <Grid item lg={4}>
                        {bind("Conductivity2", "k", "", 100)}
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          display: "flex",
                          paddingTop: "2%",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2">x</Typography>
                      </Grid>
                      <Grid item lg={4}>
                        {bind("Gradient2", "i", "", 100)}
                      </Grid>
                      <Grid lg={12}>
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
                        lg={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {bind("Porosity2", "n", "", 100)}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Grid
                        item
                        lg={2}
                        sx={{
                          display: "flex",
                          paddingTop: "2%",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2">=</Typography>
                      </Grid>
                      <Grid
                        item
                        lg={10}
                        columnSpacing={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {bind("HorizontalVelocity", "v", "", 100)}
                        <Typography variant="body2" color="text.secondary">
                          ft/day
                        </Typography>
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

                {!isTest && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={!allPanelsComplete}
                    onClick={() => setSubmitModalOpen(true)}
                    sx={{ mt: 3 }}
                  >
                    Submit Answers
                  </Button>
                )}
                {showTestSubmit && (
                  <>
                    {testSubmitError && (
                      <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {testSubmitError}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={!allPanelsComplete || testSubmitting}
                      onClick={handleTestSubmit}
                      sx={{ mt: 3 }}
                    >
                      {testSubmitting ? "Submitting…" : "Submit test"}
                    </Button>
                  </>
                )}
              </Stack>
            </>
          )}

          <Dialog
            open={testSubmitSuccessOpen}
            onClose={() => setTestSubmitSuccessOpen(false)}
          >
            <DialogTitle>Test submitted</DialogTitle>
            <DialogContent>
              <Typography>
                Your answers have been submitted for grading.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => navigate(ROUTES.home)}>Return home</Button>
              <Button
                variant="contained"
                onClick={() => setTestSubmitSuccessOpen(false)}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <SubmitResultsModal
            open={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
            flowRight={flowRight}
            flowTotal={FLOW_TOTAL_QUESTIONS}
            gradientRight={gradientRight}
            gradientTotal={GRADIENT_TOTAL_QUESTIONS}
            velocityRight={velocityRight}
            velocityTotal={VELOCITY_TOTAL_QUESTIONS}
            onResetChallenge={() => {
              dispatch(clearWell(1));
              dispatch(clearWell(2));
              dispatch(clearWell(3));
              dispatchResetChallenge(dispatch);
              setSubmitModalOpen(false);
            }}
            onReturnHome={() => {
              setSubmitModalOpen(false);
              navigate(ROUTES.home);
            }}
          />

          {!isTest && (
            <RealityCheck
              title="Reality Check: Horizontal Velocity"
              open={rcOpen}
              onToggleDisplay={() => setRcOpen((o) => !o)}
              available={selectedPanel === "velocity"}
            >
              <Typography paragraph>
                We use Darcy’s Law: V = (K · i) / n. K varies widely by
                material, and real geology can mix layers—flow doesn’t only
                occur in the “best” layer.{" "}
                {/* mirrors the Horizontal Velocity reality‑check text from scenario.html */}{" "}
                [1](https://geosyntec-my.sharepoint.com/personal/aang_geosyntec_com/Documents/Microsoft%20Copilot%20Chat%20Files/scenario.html)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Units: if K is ft/day and i is unitless, V will be ft/day when n
                is expressed as a fraction.
              </Typography>
            </RealityCheck>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
