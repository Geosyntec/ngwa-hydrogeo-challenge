import { Grid, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { setField } from "../../../flowDirection/flowSlice";
import { selectFlow } from "../../../flowDirection/flowSelectors";
export default function FDStep2() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const bind = (key: any, label: string, helper?: string) => {
    const f = (flow as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        onChange={(e) => dispatch(setField({ key, value: e.target.value }))}
        error={f.checked && !f.isCorrect}
        helperText={f.showAnswer ? `Answer: ${f.answer}` : helper}
        sx={{ width: 240 }}
      />
    );
  };
  return (
    <>
      <Typography variant="h6">Step 2</Typography>
      <Typography variant="body2" color="text.secondary">
        Compute elevation ratio and distances.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          {bind("DiffBtwnHighestMiddle2", "Δ Elev (High - Mid)")}
        </Grid>
        <Grid item xs={12} md={4}>
          {bind("DiffBtwnHighestLowest2", "Δ Elev (High - Low)")}
        </Grid>
        <Grid item xs={12} md={4}>
          {bind("ElevationRatio", "Elevation Ratio (2dp)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("DistanceHighestLowest", "Distance High ↔ Low (ft)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("ElevResult_X_DistanceHighMid", "X * Distance High-Mid (ft)")}
        </Grid>
      </Grid>
    </>
  );
}
