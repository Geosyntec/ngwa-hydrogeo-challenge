import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";
import {
  computeGradientValue,
  pickHydraulicPropsForHighWell,
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
export interface VelocityState {
  Gradient: AnswerField;
  Conductivity: AnswerField;
  Porosity: AnswerField;
  isSolutionShowingStep1: boolean;
  Gradient2: AnswerField;
  Conductivity2: AnswerField;
  Porosity2: AnswerField;
  HorizontalVelocity: AnswerField;
  isSolutionShowingStep2: boolean;
}
const initialState: VelocityState = {
  Gradient: field(),
  Conductivity: field(),
  Porosity: field(),
  isSolutionShowingStep1: false,
  Gradient2: field(),
  Conductivity2: field(),
  Porosity2: field(),
  HorizontalVelocity: field(),
  isSolutionShowingStep2: false,
};
const round2 = (x: number) => Math.round(x * 100) / 100;

export const velocitySlice = createSlice({
  name: "velocity",
  initialState,
  reducers: {
    setField(s, a: PayloadAction<{ key: keyof VelocityState; value: string }>) {
      const f = (s as any)[a.payload.key] as any;
      if (f && typeof f === "object" && "input" in f) {
        f.input = a.payload.value;
      }
    },
    checkStep1(
      s,
      a: PayloadAction<{ s: RootState; check?: boolean; show?: boolean }>,
    ) {
      const { s: rs, check, show } = a.payload;
      const g = computeGradientValue(rs);
      const { conductivity, porosityFrac } = pickHydraulicPropsForHighWell(rs);
      if (g != null) {
        s.Gradient.answer = String(g);
        s.Gradient.isCorrect = g === parseFloat(s.Gradient.input || "");
      }
      if (conductivity != null) {
        s.Conductivity.answer = String(conductivity);
        s.Conductivity.isCorrect =
          conductivity === parseFloat(s.Conductivity.input || "");
      }
      if (porosityFrac != null) {
        s.Porosity.answer = String(porosityFrac.toFixed(2));
        s.Porosity.isCorrect =
          parseFloat(s.Porosity.input || "") === porosityFrac;
      }
      if (check) {
        s.Gradient.checked = s.Conductivity.checked = s.Porosity.checked = true;
      }
      if (show) {
        s.Gradient.showAnswer =
          s.Conductivity.showAnswer =
          s.Porosity.showAnswer =
            true;
        s.isSolutionShowingStep1 = true;
      }
    },
    checkStep2(
      s,
      a: PayloadAction<{ s: RootState; check?: boolean; show?: boolean }>,
    ) {
      const { s: rs, check, show } = a.payload;
      const g = computeGradientValue(rs);
      const { conductivity, porosityFrac } = pickHydraulicPropsForHighWell(rs);
      if (g != null) {
        s.Gradient2.answer = String(g);
        s.Gradient2.isCorrect = g === parseFloat(s.Gradient2.input || "");
      }
      if (conductivity != null) {
        s.Conductivity2.answer = String(conductivity);
        s.Conductivity2.isCorrect =
          conductivity === parseFloat(s.Conductivity2.input || "");
      }
      if (porosityFrac != null) {
        s.Porosity2.answer = String(porosityFrac.toFixed(2));
        s.Porosity2.isCorrect =
          parseFloat(s.Porosity2.input || "") === porosityFrac;
      }
      if (g != null && conductivity != null && porosityFrac) {
        const hv = round2((g * conductivity) / porosityFrac);
        s.HorizontalVelocity.answer = String(hv);
        s.HorizontalVelocity.isCorrect =
          hv === parseFloat(s.HorizontalVelocity.input || "");
      }
      if (check) {
        s.Gradient2.checked =
          s.Conductivity2.checked =
          s.Porosity2.checked =
          s.HorizontalVelocity.checked =
            true;
      }
      if (show) {
        s.Gradient2.showAnswer =
          s.Conductivity2.showAnswer =
          s.Porosity2.showAnswer =
          s.HorizontalVelocity.showAnswer =
            true;
        s.isSolutionShowingStep2 = true;
      }
    },
    resetVelocity(s) {
      Object.assign(s, initialState);
    },
  },
});
export const { setField, checkStep1, checkStep2, resetVelocity } =
  velocitySlice.actions;
export default velocitySlice.reducer;
export const selectVelocity = (s: RootState) => s.velocity;
