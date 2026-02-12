import { Grid, TextField, Typography,Stack,Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { setField } from "../../../flowDirection/flowSlice";
import { selectFlow } from "../../../flowDirection/flowSelectors";

export default function FDStep1() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const bind = (
    key: any,
    label: string,
    helper?: string,
    maxLength?: number
  ) => {
    const f: any = (flow as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        onChange={(e) =>
          dispatch(
            setField({
              key,
              value: maxLength
                ? e.target.value.slice(0, maxLength)
                : e.target.value,
            })
          )
        }
        error={f.checked && !f.isCorrect}
        helperText={f.showAnswer ? `Answer: ${f.answer}` : helper}
        sx={{ width: 220 }}
      />
    );
  };
  return (
    <>
      <Typography variant="h6">Step 1</Typography>
      <Typography variant="body2" color="text.secondary">
        Identify the high, low, and remaining wells and compute differences.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          {bind(
            "HighestWaterTableName",
            "Highest well (letter)",
            "Enter A/B/C…",
            1
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("HighestWaterTableValue", "Its elevation (ft)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind(
            "LowestWaterTableName",
            "Lowest well (letter)",
            "Enter A/B/C…",
            1
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("LowestWaterTableValue", "Its elevation (ft)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind(
            "RemainingWellName",
            "Remaining well (letter)",
            "Enter A/B/C…",
            1
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("RemainingWellValue", "Its elevation (ft)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("DiffBtwnHighestLowest", "Δ Elev (High - Low)")}
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("DiffBtwnHighestMiddle", "Δ Elev (High - Mid)")}
        </Grid>
      </Grid>
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
    </>
  );
}
