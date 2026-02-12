import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  computeYLengthFeet,
  computeGradientValue,
} from "../services/drawingMath";

export interface AnswerField {
  input: string;
  checked: boolean;
  isCorrect: boolean;
  showAnswer: boolean;
  answer: string;
}
const field = (): AnswerField => ({
  input: "",
  checked: false,
  isCorrect: false,
  showAnswer: false,
  answer: "",
});
export interface GradientState {
  WhatIsDistanceYValue: AnswerField;
  isCheckingStep1: boolean;
  isSolutionShowingStep1: boolean;
  HighestWaterTableValue: AnswerField;
  RemainingWellValue: AnswerField;
  WhatIsDistanceYValue2: AnswerField;
  Gradient: AnswerField;
  isSolutionShowingStep2: boolean;
}
const initialState: GradientState = {
  WhatIsDistanceYValue: field(),
  isCheckingStep1: false,
  isSolutionShowingStep1: false,
  HighestWaterTableValue: field(),
  RemainingWellValue: field(),
  WhatIsDistanceYValue2: field(),
  Gradient: field(),
  isSolutionShowingStep2: false,
};
const numberWithCommas = (n: number | string) => {
  const s = typeof n === "number" ? n.toString() : n;
  const v = Number(s);
  return Number.isNaN(v) ? s : v.toLocaleString("en-US");
};
const stripCommas = (s: string) => s.replace(/,/g, "");

export const gradientSlice = createSlice({
  name: "gradient",
  initialState,
  reducers: {
    setField(
      s: any,
      a: PayloadAction<{ key: keyof GradientState; value: string }>,
    ) {
      const f = (s as any)[a.payload.key] as any;
      if (f && typeof f === "object" && "input" in f) {
        f.input = a.payload.value;
      }
    },

    checkStep1Applied(
      s:any,
      a: PayloadAction<{ Y?: number; check?: boolean; show?: boolean }>,
    ) {
      const { Y, check, show } = a.payload;
      s.isCheckingStep1 = true;
      if (Y != null) {
        s.WhatIsDistanceYValue.answer = numberWithCommas(Y);
        s.WhatIsDistanceYValue.isCorrect =
          Y === parseFloat(stripCommas(s.WhatIsDistanceYValue.input || ""));
      }
      if (check) s.WhatIsDistanceYValue.checked = true;
      if (show) {
        s.WhatIsDistanceYValue.showAnswer = true;
        s.isSolutionShowingStep1 = true;
      }
      s.isCheckingStep1 = false;
    },

    checkStep2Applied(
      s:any,
      a: PayloadAction<{
        hi: number;
        mid: number;
        Y?: number;
        gradient?: number;
        check?: boolean;
        show?: boolean;
      }>,
    ) {
      const { hi, mid, Y, gradient, check, show } = a.payload;
      s.HighestWaterTableValue.answer = numberWithCommas(hi);
      s.HighestWaterTableValue.isCorrect =
        hi === parseFloat(stripCommas(s.HighestWaterTableValue.input || ""));
      s.RemainingWellValue.answer = numberWithCommas(mid);
      s.RemainingWellValue.isCorrect =
        mid === parseFloat(stripCommas(s.RemainingWellValue.input || ""));
      if (Y != null) {
        s.WhatIsDistanceYValue2.answer = numberWithCommas(Y);
        s.WhatIsDistanceYValue2.isCorrect =
          Y === parseFloat(stripCommas(s.WhatIsDistanceYValue2.input || ""));
      }
      if (gradient != null) {
        s.Gradient.answer = String(gradient);
        s.Gradient.isCorrect = gradient === parseFloat(s.Gradient.input || "");
      }
      if (check) {
        s.HighestWaterTableValue.checked =
          s.RemainingWellValue.checked =
          s.WhatIsDistanceYValue2.checked =
          s.Gradient.checked =
            true;
      }
      if (show) {
        s.HighestWaterTableValue.showAnswer =
          s.RemainingWellValue.showAnswer =
          s.WhatIsDistanceYValue2.showAnswer =
          s.Gradient.showAnswer =
            true;
        s.isSolutionShowingStep2 = true;
      }
    },

    resetGradient(s: any) {
      Object.assign(s, initialState);
    },
  },
});
export const { setField, checkStep1, checkStep2, resetGradient } =
  gradientSlice.actions;
export default gradientSlice.reducer;
