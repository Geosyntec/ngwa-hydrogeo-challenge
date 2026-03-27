import type { AppDispatch } from "../../app/store";
import { resetChallengeScenarioUi } from "./ScenarioSlice";
import { reset } from "./flowDirection/flowSlice";
import { resetGradient } from "./gradient/gradientSlice";
import { resetVelocity } from "./velocity/velocitySlice";

/**
 * Clears all challenge panel form values, check/solution flags, and scenario UI
 * (open panel, popover, test submit strings). Does not change well selection;
 * pair with `clearWell` / `selectScenarioByIndex` as needed.
 */
export function dispatchResetChallenge(dispatch: AppDispatch) {
  dispatch(reset());
  dispatch(resetGradient());
  dispatch(resetVelocity());
  dispatch(resetChallengeScenarioUi());
}
