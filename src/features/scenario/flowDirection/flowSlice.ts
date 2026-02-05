import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";
import type {
  FlowDirectionUIState,
  AnswerField,
  StepCheckOptions,
} from "./flowTypes";
import {
  selectMap,
  selectSelectedWellIds,
  selectWells,
} from "../ScenarioSlice";
import { computeActualFlowDirectionAngle } from "../services/drawingMath";

const precise_round = (n: number, d: number) => {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
};
const numberWithCommas = (x: number | string) => {
  const s = typeof x === "number" ? x.toString() : x;
  const n = Number(s);
  return Number.isNaN(n) ? s : n.toLocaleString("en-US");
};
const stripCommas = (s: string) => s.replace(/,/g, "");
const makeField = (input = ""): AnswerField => ({
  input,
  checked: false,
  isCorrect: false,
  showAnswer: false,
  answer: "",
});

const initialState: FlowDirectionUIState = {
  HighestWaterTableName: makeField(""),
  HighestWaterTableValue: makeField(""),
  LowestWaterTableName: makeField(""),
  LowestWaterTableValue: makeField(""),
  RemainingWellName: makeField(""),
  RemainingWellValue: makeField(""),
  DiffBtwnHighestLowest: makeField(""),
  DiffBtwnHighestMiddle: makeField(""),
  isCheckingStep1: false,
  isSolutionShowingStep1: false,
  DiffBtwnHighestLowest2: makeField(""),
  DiffBtwnHighestMiddle2: makeField(""),
  ElevationRatio: makeField(""),
  DistanceHighestLowest: makeField(""),
  ElevResult_X_DistanceHighMid: makeField(""),
  isCheckingStep2: false,
  isSolutionShowingStep2: false,
  SelectedDirection: makeField(""),
  DirectionAngle: 90,
  DirectionAngleDisplay: 0,
  isCheckingStep3: false,
  isSolutionShowingStep3: false,
  rightAnswers: 0,
  wrongAnswers: 0,
};

export const selectFlow = (s: RootState) => s.flowDirection;
const selectSelectedWellTriplet = createSelector(
  selectWells,
  selectSelectedWellIds,
  (wells, ids) =>
    [ids.one, ids.two, ids.three]
      .filter((id): id is string => !!id)
      .map((id) => wells.find((w) => w.id === id))
      .filter((w): w is NonNullable<typeof w> => !!w),
);
export const selectSortedByElevation = createSelector(
  selectSelectedWellTriplet,
  (arr) => [...arr].sort((a, b) => a.Elevation - b.Elevation),
);
export const selectAllWellsChosen = createSelector(
  selectSelectedWellTriplet,
  (arr) => arr.length === 3,
);
const toDisplayAngle = (angle: number) => {
  let a = angle - 90;
  if (a < 0) a = 360 + a;
  return a;
};

const flowSlice = createSlice({
  name: "flowDirection",
  initialState,
  reducers: {
    setField(
      s,
      a: PayloadAction<{ key: keyof FlowDirectionUIState; value: string }>,
    ) {
      const f = (s as any)[a.payload.key] as any;
      if (f && typeof f === "object" && "input" in f) {
        f.input = a.payload.value;
      }
    },
    setDirectionAngle(s, a: PayloadAction<number>) {
      s.DirectionAngle = a.payload;
      s.SelectedDirection.input = String(a.payload);
      s.DirectionAngleDisplay = toDisplayAngle(a.payload);
    },
    reset(s) {
      Object.assign(s, initialState);
    },
    tally(s) {
      const fields: AnswerField[] = [
        s.HighestWaterTableName,
        s.HighestWaterTableValue,
        s.LowestWaterTableName,
        s.LowestWaterTableValue,
        s.RemainingWellName,
        s.RemainingWellValue,
        s.DiffBtwnHighestLowest,
        s.DiffBtwnHighestMiddle,
        s.DiffBtwnHighestLowest2,
        s.DiffBtwnHighestMiddle2,
        s.ElevationRatio,
        s.DistanceHighestLowest,
        s.ElevResult_X_DistanceHighMid,
        s.SelectedDirection,
      ];
      s.rightAnswers = fields.filter((f) => f.isCorrect).length;
      s.wrongAnswers = fields.filter((f) => f.checked && !f.isCorrect).length;
    },
    _applyStep1Result(
      s,
      a: PayloadAction<{
        hiName: string;
        hiVal: number;
        loName: string;
        loVal: number;
        midName: string;
        midVal: number;
        diffHighLow: number;
        diffHighMid: number;
        options: StepCheckOptions;
      }>,
    ) {
      const {
        hiName,
        hiVal,
        loName,
        loVal,
        midName,
        midVal,
        diffHighLow,
        diffHighMid,
        options,
      } = a.payload;
      s.isCheckingStep1 = true;
      s.HighestWaterTableName.answer = hiName;
      s.HighestWaterTableName.isCorrect =
        hiName.toLowerCase() ===
        (s.HighestWaterTableName.input || "").toLowerCase();
      s.HighestWaterTableValue.answer = numberWithCommas(hiVal);
      s.HighestWaterTableValue.isCorrect =
        parseFloat(String(hiVal)) ===
        parseFloat(stripCommas(s.HighestWaterTableValue.input || ""));
      s.LowestWaterTableName.answer = loName;
      s.LowestWaterTableName.isCorrect =
        loName.toLowerCase() ===
        (s.LowestWaterTableName.input || "").toLowerCase();
      s.LowestWaterTableValue.answer = numberWithCommas(loVal);
      s.LowestWaterTableValue.isCorrect =
        parseFloat(String(loVal)) ===
        parseFloat(stripCommas(s.LowestWaterTableValue.input || ""));
      s.RemainingWellName.answer = midName;
      s.RemainingWellName.isCorrect =
        midName.toLowerCase() ===
        (s.RemainingWellName.input || "").toLowerCase();
      s.RemainingWellValue.answer = numberWithCommas(midVal);
      s.RemainingWellValue.isCorrect =
        parseFloat(String(midVal)) ===
        parseFloat(stripCommas(s.RemainingWellValue.input || ""));
      s.DiffBtwnHighestLowest.answer = String(diffHighLow);
      s.DiffBtwnHighestLowest.isCorrect =
        String(diffHighLow) === (s.DiffBtwnHighestLowest.input || "");
      s.DiffBtwnHighestMiddle.answer = String(diffHighMid);
      s.DiffBtwnHighestMiddle.isCorrect =
        String(diffHighMid) === (s.DiffBtwnHighestMiddle.input || "");
      if (options.checkAnswers) {
        s.HighestWaterTableName.checked =
          s.HighestWaterTableValue.checked =
          s.LowestWaterTableName.checked =
          s.LowestWaterTableValue.checked =
          s.RemainingWellName.checked =
          s.RemainingWellValue.checked =
          s.DiffBtwnHighestLowest.checked =
          s.DiffBtwnHighestMiddle.checked =
            true;
      }
      if (options.showAnswers) {
        s.HighestWaterTableName.showAnswer =
          s.HighestWaterTableValue.showAnswer =
          s.LowestWaterTableName.showAnswer =
          s.LowestWaterTableValue.showAnswer =
          s.RemainingWellName.showAnswer =
          s.RemainingWellValue.showAnswer =
          s.DiffBtwnHighestLowest.showAnswer =
          s.DiffBtwnHighestMiddle.showAnswer =
            true;
        s.isSolutionShowingStep1 = true;
      }
      s.isCheckingStep1 = false;
    },
    _applyStep2Result(
      s,
      a: PayloadAction<{
        diffHighLow: number;
        diffHighMid: number;
        elevationRatio: string;
        distHighLow: number;
        formulaResult: number;
        options: StepCheckOptions;
      }>,
    ) {
      const {
        diffHighLow,
        diffHighMid,
        elevationRatio,
        distHighLow,
        formulaResult,
        options,
      } = a.payload;
      s.isCheckingStep2 = true;
      s.DiffBtwnHighestLowest2.answer = String(diffHighLow);
      s.DiffBtwnHighestLowest2.isCorrect =
        String(diffHighLow) === (s.DiffBtwnHighestLowest2.input || "");
      s.DiffBtwnHighestMiddle2.answer = String(diffHighMid);
      s.DiffBtwnHighestMiddle2.isCorrect =
        String(diffHighMid) === (s.DiffBtwnHighestMiddle2.input || "");
      s.ElevationRatio.answer = elevationRatio;
      s.ElevationRatio.isCorrect =
        parseFloat(elevationRatio) === parseFloat(s.ElevationRatio.input || "");
      s.DistanceHighestLowest.answer = numberWithCommas(distHighLow);
      s.DistanceHighestLowest.isCorrect =
        distHighLow ===
        parseFloat(stripCommas(s.DistanceHighestLowest.input || ""));
      s.ElevResult_X_DistanceHighMid.answer = numberWithCommas(formulaResult);
      s.ElevResult_X_DistanceHighMid.isCorrect =
        formulaResult ===
        parseFloat(stripCommas(s.ElevResult_X_DistanceHighMid.input || ""));
      if (options.checkAnswers) {
        s.DiffBtwnHighestLowest2.checked =
          s.DiffBtwnHighestMiddle2.checked =
          s.ElevationRatio.checked =
          s.DistanceHighestLowest.checked =
          s.ElevResult_X_DistanceHighMid.checked =
            true;
      }
      if (options.showAnswers) {
        s.DiffBtwnHighestLowest2.showAnswer =
          s.DiffBtwnHighestMiddle2.showAnswer =
          s.ElevationRatio.showAnswer =
          s.DistanceHighestLowest.showAnswer =
          s.ElevResult_X_DistanceHighMid.showAnswer =
            true;
        s.isSolutionShowingStep2 = true;
      }
      s.isCheckingStep2 = false;
    },
    _applyStep3Result(
      s,
      a: PayloadAction<{
        actualAngle: number;
        threshold: number;
        options: StepCheckOptions;
      }>,
    ) {
      const { actualAngle, threshold, options } = a.payload;
      const userDir = parseFloat(s.SelectedDirection.input || "0");
      let start = actualAngle - threshold,
        end = actualAngle + threshold;
      if (start < 0 && userDir > 180) {
        start = 360 + start;
        end = 360;
      }
      if (end > 360 && userDir < 180) {
        start = 0;
        end = end - 360;
      }
      const correct = userDir >= start && userDir <= end;
      s.SelectedDirection.isCorrect = correct;
      s.SelectedDirection.answer = `${toDisplayAngle(actualAngle)}° +/- ${threshold}°`;
      if (options.checkAnswers) s.SelectedDirection.checked = true;
      if (options.showAnswers) {
        s.SelectedDirection.showAnswer = true;
        s.isSolutionShowingStep3 = true;
      }
      s.isCheckingStep3 = false;
    },
  },
});
export const {
  setField,
  setDirectionAngle,
  reset,
  tally,
  _applyStep1Result,
  _applyStep2Result,
  _applyStep3Result,
} = flowSlice.actions;
export default flowSlice.reducer;

export const runCheckStep1 =
  (options: StepCheckOptions = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState();
    const sorted = (selectSortedByElevation as any)(s);
    if (sorted.length < 3) return;
    const lo = sorted[0],
      mid = sorted[1],
      hi = sorted[2];
    const diffHighLow = precise_round(hi.Elevation - lo.Elevation, 1);
    const diffHighMid = precise_round(hi.Elevation - mid.Elevation, 1);
    dispatch(
      _applyStep1Result({
        hiName: hi.Name,
        hiVal: hi.Elevation,
        loName: lo.Name,
        loVal: lo.Elevation,
        midName: mid.Name,
        midVal: mid.Elevation,
        diffHighLow,
        diffHighMid,
        options,
      }),
    );
  };
export const runCheckStep2 =
  (options: StepCheckOptions = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState();
    const sorted = (selectSortedByElevation as any)(s);
    if (sorted.length < 3) return;
    const lo = sorted[0],
      mid = sorted[1],
      hi = sorted[2];
    const diffHighLow = precise_round(hi.Elevation - lo.Elevation, 1);
    const diffHighMid = precise_round(hi.Elevation - mid.Elevation, 1);
    const elevationRatio = precise_round(diffHighMid / diffHighLow, 2).toFixed(
      2,
    );
    const map = selectMap(s);
    const ratio = map ? (map.physicalWidth * 5280) / map.width : 1;
    const distHighLow = Math.round(
      Math.hypot(hi.Point.x - lo.Point.x, hi.Point.y - lo.Point.y) * ratio,
    );
    const formulaResult = precise_round(
      distHighLow * parseFloat(elevationRatio),
      0,
    );
    dispatch(
      _applyStep2Result({
        diffHighLow,
        diffHighMid,
        elevationRatio,
        distHighLow,
        formulaResult,
        options,
      }),
    );
  };
export const runCheckStep3 =
  (options: StepCheckOptions = {}, actualAngle?: number) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState();
    const computed = computeActualFlowDirectionAngle(s);
    const fallbackAngle = 90;
    dispatch(
      _applyStep3Result({
        actualAngle: actualAngle ?? computed ?? fallbackAngle,
        threshold: 10,
        options,
      }),
    );
  };

// completion gates
const _filled = (f?: { input?: string; showAnswer?: boolean }) =>
  !!(f && ((f.input ?? "").trim() !== "" || f.showAnswer));
export const selectFlowStep1Complete = (s: RootState) => {
  const f: any = s.flowDirection;
  return (
    _filled(f.HighestWaterTableName) &&
    _filled(f.HighestWaterTableValue) &&
    _filled(f.LowestWaterTableName) &&
    _filled(f.LowestWaterTableValue) &&
    _filled(f.RemainingWellName) &&
    _filled(f.RemainingWellValue) &&
    _filled(f.DiffBtwnHighestLowest) &&
    _filled(f.DiffBtwnHighestMiddle)
  );
};
export const selectFlowStep2Complete = (s: RootState) => {
  const f: any = s.flowDirection;
  return (
    _filled(f.DiffBtwnHighestLowest2) &&
    _filled(f.DiffBtwnHighestMiddle2) &&
    _filled(f.ElevationRatio) &&
    _filled(f.DistanceHighestLowest) &&
    _filled(f.ElevResult_X_DistanceHighMid)
  );
};
export const selectFlowStep3Complete = (s: RootState) => {
  const f: any = s.flowDirection;
  return _filled(f.SelectedDirection);
};
