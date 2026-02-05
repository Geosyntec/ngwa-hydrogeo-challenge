export interface AnswerField {
  input: string;
  checked: boolean;
  isCorrect: boolean;
  showAnswer: boolean;
  answer: string;
}
export interface FlowDirectionUIState {
  HighestWaterTableName: AnswerField;
  HighestWaterTableValue: AnswerField;
  LowestWaterTableName: AnswerField;
  LowestWaterTableValue: AnswerField;
  RemainingWellName: AnswerField;
  RemainingWellValue: AnswerField;
  DiffBtwnHighestLowest: AnswerField;
  DiffBtwnHighestMiddle: AnswerField;
  isCheckingStep1: boolean;
  isSolutionShowingStep1: boolean;
  DiffBtwnHighestLowest2: AnswerField;
  DiffBtwnHighestMiddle2: AnswerField;
  ElevationRatio: AnswerField;
  DistanceHighestLowest: AnswerField;
  ElevResult_X_DistanceHighMid: AnswerField;
  isCheckingStep2: boolean;
  isSolutionShowingStep2: boolean;
  SelectedDirection: AnswerField;
  DirectionAngle: number;
  DirectionAngleDisplay: number;
  isCheckingStep3: boolean;
  isSolutionShowingStep3: boolean;
  rightAnswers: number;
  wrongAnswers: number;
}
export type StepCheckOptions = {
  checkAnswers?: boolean;
  showAnswers?: boolean;
  allowDrawing?: boolean;
};
