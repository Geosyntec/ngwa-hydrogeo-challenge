import { Stack, TextField, Typography,Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { setDirectionAngle, setField } from "../../../flowDirection/flowSlice";
import { selectFlow,selectFlowStep2Complete,runCheckStep3 } from "../../../flowDirection/flowSelectors";
import CompassSelector from "./CompassSelector";

export default function FDStep3() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const stepReady = useAppSelector(selectFlowStep2Complete)
  return (
    <>
      <Typography variant="h6">Step 3</Typography>
      <Typography variant="body2" color="text.secondary">
        Choose the groundwater flow direction (degrees). Drag the dial or type a
        value.
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        sx={{ mt: 1 }}
      >
        <CompassSelector display={stepReady} />
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
        >
          <TextField
            size="small"
            label="Direction (degrees)"
            value={flow.SelectedDirection.input}
            disabled={!stepReady}
            onChange={(e) =>
              dispatch(
                setField({ key: "SelectedDirection", value: e.target.value })
              )
            }
            error={
              flow.SelectedDirection.checked &&
              !flow.SelectedDirection.isCorrect
            }
            helperText={
              flow.SelectedDirection.showAnswer
                ? `Answer: ${flow.SelectedDirection.answer}`
                : "0..360 (Raphael angle)"
            }
            sx={{ width: 220 }}
          />
          <TextField
            size="small"
            label="Internal Angle"
            value={Math.round(flow.DirectionAngle)}
            onChange={(e) =>
              dispatch(setDirectionAngle(parseFloat(e.target.value) || 0))
            }
            sx={{ width: 220 }}
            disabled={!stepReady}
          />
          <Typography variant="body2">
            Display Angle: {Math.round(flow.DirectionAngleDisplay)}°
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => dispatch(runCheckStep3({ checkAnswers: true }))}
          disabled={!stepReady}
        >
          Check Step 3
        </Button>
        <Button
          variant="outlined"
          onClick={() => dispatch(runCheckStep3({ showAnswers: true }))}
          disabled={!stepReady}
        >
          Show Step 3 Solution
        </Button>
      </Stack>
    </>
  );
}
