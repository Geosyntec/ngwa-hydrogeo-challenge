import type { RootState } from "../../app/store";
import type { SubmitGradesPayload, SubmitGradesAnswers } from "../../api/mockSubmitGradesApi";
import { selectScenarioState, selectSelectedWellIds } from "./ScenarioSlice";
import {
  selectFlow,
  FLOW_TOTAL_QUESTIONS,
  selectFlowRightCount,
} from "./flowDirection/flowSelectors";
import { selectGradient } from "./gradient/gradientSlice";
import {
  GRADIENT_TOTAL_QUESTIONS,
  selectGradientRightCount,
} from "./gradient/gradientSelectors";
import { selectVelocity } from "./velocity/velocitySelectors";
import {
  VELOCITY_TOTAL_QUESTIONS,
  selectVelocityRightCount,
} from "./velocity/velocitySelectors";

const FLOW_ANSWER_KEYS = [
  "HighestWaterTableName",
  "HighestWaterTableValue",
  "LowestWaterTableName",
  "LowestWaterTableValue",
  "RemainingWellName",
  "RemainingWellValue",
  "DiffBtwnHighestLowest",
  "DiffBtwnHighestMiddle",
  "DiffBtwnHighestLowest2",
  "DiffBtwnHighestMiddle2",
  "ElevationRatio",
  "DistanceHighestLowest",
  "ElevResult_X_DistanceHighMid",
  "SelectedDirection",
] as const;

const GRADIENT_ANSWER_KEYS = [
  "WhatIsDistanceYValue",
  "HighestWaterTableValue",
  "RemainingWellValue",
  "WhatIsDistanceYValue2",
  "Gradient",
] as const;

const VELOCITY_ANSWER_KEYS = [
  "Gradient",
  "Conductivity",
  "Porosity",
  "Gradient2",
  "Conductivity2",
  "Porosity2",
  "HorizontalVelocity",
] as const;

function getAnswersFromFields(
  stateSlice: Record<string, { input?: string }>,
  keys: readonly string[]
): SubmitGradesAnswers {
  const out: SubmitGradesAnswers = {};
  for (const key of keys) {
    const field = stateSlice[key];
    if (field && field.input !== undefined) {
      const raw = field.input.trim();
      const num = Number(raw);
      out[key] = Number.isNaN(num) ? raw : num;
    }
  }
  return out;
}

/**
 * Builds the payload for POST /submit-grades from the current app state.
 * Use when the student submits the test scenario.
 */
export function buildSubmitGradesPayload(state: RootState): SubmitGradesPayload | null {
  const scenario = selectScenarioState(state);
  const { scenarios, scenarioIndex } = scenario;
  const currentScenario = scenarios[scenarioIndex];
  if (!currentScenario) return null;

  const selectedWells = selectSelectedWellIds(state);
  const wellIds = [
    selectedWells.one,
    selectedWells.two,
    selectedWells.three,
  ].filter((id): id is string => !!id);

  const flowState = selectFlow(state) as unknown as Record<string, { input?: string }>;
  const gradientState = selectGradient(state) as unknown as Record<string, { input?: string }>;
  const velocityState = selectVelocity(state) as unknown as Record<string, { input?: string }>;

  const answers: SubmitGradesAnswers = {
    ...getAnswersFromFields(flowState, FLOW_ANSWER_KEYS),
    ...getAnswersFromFields(gradientState, GRADIENT_ANSWER_KEYS),
    ...getAnswersFromFields(velocityState, VELOCITY_ANSWER_KEYS),
  };

  const flowRight = selectFlowRightCount(state);
  const gradientRight = selectGradientRightCount(state);
  const velocityRight = selectVelocityRightCount(state);
  const totalRight = flowRight + gradientRight + velocityRight;
  const totalQuestions =
    FLOW_TOTAL_QUESTIONS + GRADIENT_TOTAL_QUESTIONS + VELOCITY_TOTAL_QUESTIONS;
  const percentage =
    totalQuestions > 0 ? Math.round((totalRight / totalQuestions) * 100) : 0;

  return {
    scenarioId: currentScenario.id,
    selectedWells: wellIds,
    answers,
    grades: {
      flowRight,
      flowTotal: FLOW_TOTAL_QUESTIONS,
      gradientRight,
      gradientTotal: GRADIENT_TOTAL_QUESTIONS,
      velocityRight,
      velocityTotal: VELOCITY_TOTAL_QUESTIONS,
      percentage,
    },
  };
}
