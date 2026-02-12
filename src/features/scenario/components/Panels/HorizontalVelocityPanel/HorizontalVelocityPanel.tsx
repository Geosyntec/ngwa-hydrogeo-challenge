import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectVelocity,
  checkStep1,
  checkStep2,
} from "../../../velocity/velocitySelectors";
import{setField} from "../../../velocity/velocitySlice";
import { selectSortedByElevation } from "../../../flowDirection/flowSlice";
import { selectGradientStep2Complete } from "../../../gradient/gradientSelectors";
import { selectScenarioState, setSelectedPanel } from "../../../ScenarioSlice";
import { useCallback, useState } from "react";
import RealityCheck from '../../RealityCheck/RealityCheck'


export default function HorizontalVelocityPanel() {
  const dispatch = useAppDispatch();
  const v = useAppSelector(selectVelocity);
  const sorted = useAppSelector(selectSortedByElevation);
  const gradReady = useAppSelector(selectGradientStep2Complete);
  const { selectedPanel } = useAppSelector(selectScenarioState);
  const ready = sorted.length === 3;
  const onToggle = useCallback(
    (_e: any, expanded: boolean) => {
      dispatch(setSelectedPanel(expanded ? "velocity" : null));
    },
    [dispatch],
  );
  const bind = (
    key: keyof ReturnType<typeof selectVelocity>,
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
  return (
    <Accordion
      defaultExpanded
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
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      dispatch(
                        checkStep2({
                          s: (window as any).store?.getState?.() ?? ({} as any),
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
