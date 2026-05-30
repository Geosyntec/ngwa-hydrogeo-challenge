import { Grid, TextField, Typography, Stack, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { panelBindTextFieldSx } from "../panelBindTextFieldSx";
import { renderHelperText } from "../renderHelperText";
import { setField } from "../../../flowDirection/flowSlice";
import {
  selectFlow,
  runCheckStep1,
} from "../../../flowDirection/flowSelectors";
import { selectScenarioState } from "../../../ScenarioSlice";

export default function FDStep1() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const isTest = useAppSelector(selectScenarioState).isTest;
  const bind = (
    key: any,
    label: string,
    helper?: string,
    maxLength?: number,
    width?:number
  ) => {
    const f: any = (flow as any)[key];
    return (
      <TextField
        size="small"
        label={label}
        value={f.input}
        onChange={(e) => {
          dispatch(
            setField({
              key,
              value: maxLength
                ? e.target.value.slice(0, maxLength)
                : e.target.value,
            })
          )
          if (f.checked) {
            dispatch(runCheckStep1({ checkAnswers: true }))
          }
        }
        }
        error={f.checked && !f.isCorrect && !isTest}
        FormHelperTextProps={{
          sx: {
            position: "relative",
            left: "110%",
            top: "-35px",
            maxWidth: "none",
            width: "max-content",
          },
        }}
        helperText={renderHelperText(
          f.showAnswer,
          f.checked && !isTest,
          f.isCorrect,
          f.answer,
          helper,
          isTest
        )}
        sx={panelBindTextFieldSx(width ?? 50, !!f.showAnswer)}
      />
    );
  };
  return (
    <>
      <Typography variant="h6">Step 1</Typography>
      <Typography variant="body2" color="text.secondary">
        What is the...
      </Typography>
      <Grid container columnSpacing={0} rowSpacing={0}>
        {/* Highest Well Row */}
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            Well with the highest <br /> water table elevation:
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          {bind("HighestWaterTableName", "", "", 1)}
        </Grid>
        <Grid item md={2}></Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            Enter its elevation (ft):
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          {bind("HighestWaterTableValue", "", "", undefined,100)}
        </Grid>
        {/* Lowest Well Row */}
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            Well with the lowest <br /> water table elevation:
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          {bind("LowestWaterTableName", "", "", 1)}
        </Grid>
        <Grid item md={2}></Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
          Enter its elevation (ft):
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          {bind("LowestWaterTableValue", "","",undefined,100)}
        </Grid>
        {/* Middle Well Row */}
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            The remaining well:
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          {bind("RemainingWellName", "", "", 1)}
        </Grid>
        <Grid item md={2}></Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
          Enter its elevation (ft):
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          {bind("RemainingWellValue", "","",undefined,100)}
        </Grid>
        {/* Difference Rows */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
          What is the difference in elevation between the <strong>highest</strong> and <strong>lowest</strong> wells (ft):
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("DiffBtwnHighestLowest", "","",undefined,100)}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
          What is the difference in elevation between the <strong>highest</strong> and <strong>middle</strong> wells (ft):
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {bind("DiffBtwnHighestMiddle", "","",undefined,100)}
        </Grid>
      </Grid>
      {!isTest && (
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
      )}
    </>
  );
}
