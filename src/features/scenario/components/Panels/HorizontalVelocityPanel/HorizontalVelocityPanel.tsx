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
import { reset as resetFlow } from "../../../flowDirection/flowSlice";
import { resetGradient } from "../../../gradient/gradientSlice";
import { resetVelocity } from "../../../velocity/velocitySlice";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RealityCheck from "../../RealityCheck/RealityCheck";
import SubmitResultsModal from "../SubmitResultsModal";
import { ROUTES } from "../../../../../app/routes";
import { store } from "../../../../../app/store";
import { buildSubmitGradesPayload } from "../../../submitGradesPayload";
import { submitGrades } from "../../../../../api/mockSubmitGradesApi";


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
  const ready = sorted.length === 3;
  useEffect(() => {
    if (gradReady && selectedPanel !== "gradient") {
      dispatch(setSelectedPanel("gradient"));
    }
  }, [gradReady, dispatch]);

  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "velocity" : null));
    },
    [dispatch],
  );
  const bind = (
    key: keyof VelocityState,
    label: string,
    helper?: string,
  ) => {
    const f: any = (v as any)[key];
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
  const [rcOpen, setRcOpen] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testSubmitSuccessOpen, setTestSubmitSuccessOpen] = useState(false);
  const handleTestSubmit = useCallback(async () => {
    const payload = buildSubmitGradesPayload(store.getState());
    if (!payload) return;
    setTestSubmitting(true);
    try {
      await submitGrades(payload);
      setTestSubmitSuccessOpen(true);
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
        <Typography variant="subtitle1">Horizontal Velocity</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ position: "relative", overflow: "visible" }}>
          {!gradReady && (
            <Typography variant="body2" color="text.secondary">
              Complete <strong>Gradient – Step 2</strong> to unlock Horizontal
              Velocity.
            </Typography>
          )}
          {gradReady && ready && (
            <Stack spacing={3}>
              <div>
                <Typography variant="h6">Step 1</Typography>
                <Typography variant="body2" color="text.secondary">
                  Determine Gradient, Conductivity, and Porosity (fraction).
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    {bind("Gradient", "Gradient (4 dp)")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {bind("Conductivity", "Conductivity k")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {bind("Porosity", "Porosity (fraction)")}
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
                          check: true,
                          show: true,
                        }),
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
                  Compute <strong>Horizontal Velocity</strong> = (Gradient ×
                  Conductivity) / Porosity, 2 dp.
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={3}>
                    {bind("Gradient2", "Gradient (4 dp)")}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {bind("Conductivity2", "Conductivity k")}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {bind("Porosity2", "Porosity (fraction)")}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {bind("HorizontalVelocity", "Horizontal Velocity (2 dp)")}
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
                          check: true,
                          show: true,
                        }),
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
              {isTest && (
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
              )}
            </Stack>
          )}

          <Dialog open={testSubmitSuccessOpen} onClose={() => setTestSubmitSuccessOpen(false)}>
            <DialogTitle>Test submitted</DialogTitle>
            <DialogContent>
              <Typography>Your answers have been submitted for grading.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => navigate(ROUTES.home)}>Return home</Button>
              <Button variant="contained" onClick={() => setTestSubmitSuccessOpen(false)}>Close</Button>
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
              dispatch(resetFlow());
              dispatch(resetGradient());
              dispatch(resetVelocity());
              dispatch(setSelectedPanel(null));
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
            onToggle={() => setRcOpen((o) => !o)}
            available={selectedPanel === "velocity"}
          >
            <Typography paragraph>
              We use Darcy’s Law: V = (K · i) / n. K varies widely by material,
              and real geology can mix layers—flow doesn’t only occur in the
              “best” layer.{" "}
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
