import type { RootState } from '../../../app/store'
import { selectGradient as _selectGradient, checkStep1Applied, checkStep2Applied } from './gradientSlice'
import { selectSortedByElevation } from '../flowDirection/flowSlice'
import { computeYLengthFeet, computeGradientValue } from '../services/drawingMath'

export const selectGradient = (s: RootState) => _selectGradient(s)

const _filled = (f?: { input?: string; showAnswer?: boolean }) =>
  !!(f && (((f.input ?? '').trim() !== '') || f.showAnswer))

export const selectGradientStep1Complete = (s: RootState) => {
  const g: any = selectGradient(s)
  return _filled(g.WhatIsDistanceYValue)
}

export const selectGradientStep2Complete = (s: RootState) => {
  const g: any = selectGradient(s)
  return _filled(g.HighestWaterTableValue) &&
         _filled(g.RemainingWellValue) &&
         _filled(g.WhatIsDistanceYValue2) &&
         _filled(g.Gradient)
}

export const checkStep1 = (opts: { check?: boolean; show?: boolean } = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const Y = computeYLengthFeet(s) ?? undefined
    dispatch(checkStep1Applied({ Y, check: opts.check, show: opts.show }))
  }

export const checkStep2 = (opts: { check?: boolean; show?: boolean } = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const sorted = selectSortedByElevation(s)
    if (sorted.length < 3) return
    const hi = sorted[2].Elevation
    const mid = sorted[1].Elevation
    const Y = computeYLengthFeet(s) ?? undefined
    const gradient = computeGradientValue(s) ?? undefined
    dispatch(checkStep2Applied({ hi, mid, Y, gradient, check: opts.check, show: opts.show }))
  }