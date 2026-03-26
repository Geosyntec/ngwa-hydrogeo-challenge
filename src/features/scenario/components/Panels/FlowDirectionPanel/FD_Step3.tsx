import { Stack, Typography, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { selectFlow, selectFlowStep2Complete, runCheckStep3 } from "../../../flowDirection/flowSelectors";
import { selectScenarioState } from "../../../ScenarioSlice";
import CompassSelector from "./CompassSelector";

export default function FDStep3() {
  const flow = useAppSelector(selectFlow);
  const dispatch = useAppDispatch();
  const stepReady = useAppSelector(selectFlowStep2Complete);
  const isTest = useAppSelector(selectScenarioState).isTest;
  const showAnswerLine = flow.SelectedDirection.showAnswer;
  const showIncorrect =
    flow.SelectedDirection.checked &&
    !flow.SelectedDirection.isCorrect &&
    !flow.SelectedDirection.showAnswer;

  return (
    <>
      <Typography variant="h6">Step 3</Typography>
      <Typography variant="body2" color="text.secondary">
        Choose the groundwater flow direction. Drag the compass dial (Alt/Option to
        snap 5°).
      </Typography>
      <Stack
        direction="column"
        alignItems="flex-start"
        spacing={1}
        sx={{ mt: 1 }}
      >
        <CompassSelector display={stepReady} />
        {showAnswerLine && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            Answer: {flow.SelectedDirection.answer}
          </Typography>
        )}
        {showIncorrect && (
          <Typography variant="body2" color="error">
            Not within tolerance — use Show Step 3 Solution to see the answer.
          </Typography>
        )}
      </Stack>
      {!isTest && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
      )}
    </>
  );
}
