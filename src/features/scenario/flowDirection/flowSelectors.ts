import type { RootState } from '../../../app/store'
import { selectMap } from '../ScenarioSlice'
import { selectSortedByElevation, _applyStep1Result, _applyStep2Result, _applyStep3Result } from './flowSlice'
import type { StepCheckOptions } from './flowTypes'

const precise_round = (n: number, d: number) => {
  const p = Math.pow(10, d)
  return Math.round(n * p) / p
}
const numberWithCommas = (x: number | string) => {
  const s = typeof x === 'number' ? x.toString() : x
  const n = Number(s)
  return Number.isNaN(n) ? s : n.toLocaleString('en-US')
}
const stripCommas = (s: string) => s.replace(/,/g, '')

const _filled = (f?: { input?: string; showAnswer?: boolean }) =>
  !!(f && (((f.input ?? '').trim() !== '') || f.showAnswer))

export const selectFlow = (s: RootState) => s.flowDirection;

export const selectFlowStep1Complete = (s: RootState) => {
  const f: any = selectFlow(s)
  return _filled(f.HighestWaterTableName) &&
    _filled(f.HighestWaterTableValue) &&
    _filled(f.LowestWaterTableName) &&
    _filled(f.LowestWaterTableValue) &&
    _filled(f.RemainingWellName) &&
    _filled(f.RemainingWellValue) &&
    _filled(f.DiffBtwnHighestLowest) &&
    _filled(f.DiffBtwnHighestMiddle)
}
export const selectFlowStep2Complete = (s: RootState) => {
  const f: any = selectFlow(s)
  return _filled(f.DiffBtwnHighestLowest2) &&
    _filled(f.DiffBtwnHighestMiddle2) &&
    _filled(f.ElevationRatio) &&
    _filled(f.DistanceHighestLowest) &&
    _filled(f.ElevResult_X_DistanceHighMid)
}
export const selectFlowStep3Complete = (s: RootState) => {
  const f: any = selectFlow(s)
  return _filled(f.SelectedDirection)
}

/** True when all three Flow Direction steps have answers (filled or solution shown). */
export const selectFlowAllStepsComplete = (s: RootState) =>
  selectFlowStep1Complete(s) &&
  selectFlowStep2Complete(s) &&
  selectFlowStep3Complete(s)

const FLOW_ANSWER_KEYS = [
  'HighestWaterTableName', 'HighestWaterTableValue', 'LowestWaterTableName', 'LowestWaterTableValue',
  'RemainingWellName', 'RemainingWellValue', 'DiffBtwnHighestLowest', 'DiffBtwnHighestMiddle',
  'DiffBtwnHighestLowest2', 'DiffBtwnHighestMiddle2', 'ElevationRatio', 'DistanceHighestLowest',
  'ElevResult_X_DistanceHighMid', 'SelectedDirection',
] as const

export const FLOW_TOTAL_QUESTIONS = FLOW_ANSWER_KEYS.length

export const selectFlowRightCount = (s: RootState) => {
  const f: any = selectFlow(s)
  return FLOW_ANSWER_KEYS.filter((key) => f[key]?.isCorrect).length
}

export const runCheckStep1 = (options: StepCheckOptions = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const sorted = selectSortedByElevation(s)
    if (sorted.length < 3) return
    const lo = sorted[0], mid = sorted[1], hi = sorted[2]
    const diffHighLow = precise_round(hi.Elevation - lo.Elevation, 1)
    const diffHighMid = precise_round(hi.Elevation - mid.Elevation, 1)
    dispatch(_applyStep1Result({
      hiName: hi.Name, hiVal: hi.Elevation,
      loName: lo.Name, loVal: lo.Elevation,
      midName: mid.Name, midVal: mid.Elevation,
      diffHighLow, diffHighMid, options
    }))
  }

export const runCheckStep2 = (options: StepCheckOptions = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const sorted = selectSortedByElevation(s)
    if (sorted.length < 3) return
    const lo = sorted[0], mid = sorted[1], hi = sorted[2]
    const diffHighLow = precise_round(hi.Elevation - lo.Elevation, 1)
    const diffHighMid = precise_round(hi.Elevation - mid.Elevation, 1)
    const elevationRatio = precise_round(diffHighMid / diffHighLow, 2).toFixed(2)
    const map = selectMap(s)
    const ratio = map ? (map.physicalWidth * 5280) / map.width : 1
    const distHighLow = Math.round(Math.hypot(hi.Point.x - lo.Point.x, hi.Point.y - lo.Point.y) * ratio)
    const formulaResult = precise_round(distHighLow * parseFloat(elevationRatio), 0)
    dispatch(_applyStep2Result({ diffHighLow, diffHighMid, elevationRatio, distHighLow, formulaResult, options }))
  }

export const runCheckStep3 = (options: StepCheckOptions = {}, actualAngle?: number) =>
  (dispatch: any, getState: () => RootState) => {
    // computeActualFlowDirectionAngle is called in the reducer path already;
    // here we pass the angle (computed externally if needed)
    const fallbackAngle = 90
    const s = getState()
    // we call the reducer with `actualAngle ?? fallback` – computation was already done in your prior code path
    dispatch(_applyStep3Result({ actualAngle: actualAngle ?? fallbackAngle, threshold: 10, options }))
  }