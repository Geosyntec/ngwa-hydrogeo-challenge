import { Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectFlow,
  setDirectionAngle,
  setField,
} from "../../../flowDirection/flowSlice";
import CompassSelector from "./CompassSelector";

export default function FDStep3() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
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
        <CompassSelector size={150} />
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
        >
          <TextField
            size="small"
            label="Direction (degrees)"
            value={flow.SelectedDirection.input}
            onChange={(e) =>
              dispatch(
                setField({ key: "SelectedDirection", value: e.target.value }),
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
          />
          <Typography variant="body2">
            Display Angle: {Math.round(flow.DirectionAngleDisplay)}°
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
