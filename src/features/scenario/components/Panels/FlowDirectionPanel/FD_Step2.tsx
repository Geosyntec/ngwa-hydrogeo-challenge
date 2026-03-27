import { Grid, TextField, Typography, Stack, Button, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { setField,selectSortedByElevation } from "../../../flowDirection/flowSlice";
import {
  selectFlow,
  selectFlowStep1Complete,
  runCheckStep2,
} from "../../../flowDirection/flowSelectors";
import { selectScenarioState } from "../../../ScenarioSlice";

export default function FDStep2() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const stepReady = useAppSelector(selectFlowStep1Complete);
  const isTest = useAppSelector(selectScenarioState).isTest;
  const sorted = useAppSelector(selectSortedByElevation)
  const bind = (key: any, label: string, helper?: string,width?:number) => {
    const f = (flow as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        disabled={!stepReady}
        onChange={(e) => dispatch(setField({ key, value: e.target.value }))}
        error={f.checked && !f.isCorrect}
        helperText={f.showAnswer ? `Answer: ${f.answer}` : helper}
        InputLabelProps={{ shrink: true }}
        sx={{ width: width ?? 100 }}
      />
    );
  };
  return (
    <>
      <Typography variant="h6">Step 2</Typography>
      <Typography variant="body2" color="text.secondary">
        Somewhere between the highest and lowest wells the groundwater elevation will be equal to the middle well elevation.
        How far from the highest well is that position?
      </Typography>
      <Grid container spacing={1}>
        <Grid item lg={3}>
          <Grid lg={12} sx={{display:'flex',justifyContent:'center'}}>
            {bind("DiffBtwnHighestMiddle2", "Δ Elev " + sorted[2].Name + " - " + sorted[1].Name)}
          </Grid>
          <Grid lg={12}>
            <Box
              sx={{
                borderTop: (t) => `2px solid black`,
                alignSelf: "stretch",
                flexShrink: 0,
                mt: 2,
                mb: 2,
              }}
            />
          </Grid>
          <Grid lg={12} sx={{display:'flex',justifyContent:'center'}}>
            {bind("DiffBtwnHighestLowest2", "Δ Elev " + sorted[2].Name + " - " + sorted[0].Name)}
          </Grid>
        </Grid>
        <Grid
          item
          lg={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item lg={2}>
            =
          </Grid>
          <Grid item lg={10} sx={{display:'flex',justifyContent:'center'}}>
            {bind("ElevationRatio", "","Round to 2 dp")}
          </Grid>
        </Grid>
        <Grid
          item
          lg={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item lg={12}>
            x
          </Grid>
          <Grid item lg={12}>
            {bind("DistanceHighestLowest", "Dist " + sorted[2].Name + " to " + sorted[0].Name)}
          </Grid>
        </Grid>
        <Grid
          item
          lg={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item lg={12}>
            =
          </Grid>
          <Grid item lg={12}>
            {bind("ElevResult_X_DistanceHighMid", "")}
          </Grid>
        </Grid>
      </Grid>
      {!isTest && (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => dispatch(runCheckStep2({ checkAnswers: true }))}
            disabled={!stepReady}
          >
            Check Step 2
          </Button>
          <Button
            variant="outlined"
            onClick={() => dispatch(runCheckStep2({ showAnswers: true }))}
            disabled={!stepReady}
          >
            Show Step 2 Solution
          </Button>
        </Stack>
      )}
    </>
  );
}
