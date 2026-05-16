import { Grid, TextField, Typography, Stack, Button, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { panelBindTextFieldSx } from "../panelBindTextFieldSx";
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
        sx={panelBindTextFieldSx(width ?? 100, !!f.showAnswer)}
      />
    );
  };
  return (
    <>
      <Typography variant="h6">Step 2</Typography>
      <Typography variant="body2" color="text.secondary">
      Somewhere along the path between the highest and lowest wells, the water table elevation will be equal to the middle well’s elevation. Use the equation below to determine where along the path this point is. Remember, use answers from Step 1 where applicable.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Grid xs={12} sx={{display:'flex',justifyContent:'center'}}>
            {bind("DiffBtwnHighestMiddle2", "Δ Elev " + sorted[2].Name + " to " + sorted[1].Name)}
          </Grid>
          <Grid lg={12}>
            <Box
              sx={{
                borderTop: (t) => `2px solid black`,
                alignSelf: "stretch",
                mt: 2,
                mb: 2,
              }}
            />
          </Grid>
          <Grid xs={12} sx={{display:'flex',justifyContent:'center'}}>
            {bind("DiffBtwnHighestLowest2", "Δ Elev " + sorted[2].Name + " to " + sorted[0].Name)}
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item xs={2}>
            =
          </Grid>
          <Grid item xs={10} sx={{display:'flex',justifyContent:'center'}}>
            {bind("ElevationRatio", "Elev Ratio","Round to 2 dp")}
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item xs={12}>
            x
          </Grid>
          <Grid item xs={12}>
            {bind("DistanceHighestLowest", "Dist " + sorted[2].Name + " to " + sorted[0].Name)}
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Grid item xs={12}>
            =
          </Grid>
          <Grid item xs={12}>
            {bind("ElevResult_X_DistanceHighMid", sorted[2].Name + " to " + sorted[2].Name + sorted[1].Name.toLowerCase() + " Dist","Round to whole number"
            )}
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="body2" color="text.secondary">
      The path between the middle elevation well to this new point is called the Water Table Contour Line.
      </Typography>
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
