import type { AppDispatch } from "../../app/store";
import {
  runCheckStep1,
  runCheckStep2,
  runCheckStep3,
} from "./flowDirection/flowSelectors";
import {
  checkStep1 as gradientCheckStep1,
  checkStep2 as gradientCheckStep2,
} from "./gradient/gradientSelectors";
import {
  checkStep1 as velocityCheckStep1,
  checkStep2 as velocityCheckStep2,
} from "./velocity/velocitySelectors";

/**
 * Recomputes correctness flags from current field inputs (same logic as Check /
 * Show solution), without revealing answers. Call immediately before grading or
 * building the submit-grades payload so counts match what the user typed.
 */
export function dispatchReevaluateAllAnswersForGrading(dispatch: AppDispatch) {
  dispatch(
    runCheckStep1({ checkAnswers: true, showAnswers: false }),
  );
  dispatch(
    runCheckStep2({ checkAnswers: true, showAnswers: false }),
  );
  dispatch(
    runCheckStep3({ checkAnswers: true, showAnswers: false }),
  );
  dispatch(gradientCheckStep1({ check: true, show: false }));
  dispatch(gradientCheckStep2({ check: true, show: false }));
  dispatch(velocityCheckStep1({ check: true, show: false }));
  dispatch(velocityCheckStep2({ check: true, show: false }));
}
