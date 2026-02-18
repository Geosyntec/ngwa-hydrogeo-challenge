import type { RootState } from '../../../app/store'
import { selectVelocity as _selectVelocity, checkStep1Applied, checkStep2Applied } from './velocitySlice'
import { computeGradientValue, pickHydraulicPropsForHighWell } from '../services/drawingMath'

export const selectVelocity = (s: RootState) => _selectVelocity(s)

const _filled = (f?: { input?: string; showAnswer?: boolean }) =>
  !!(f && (((f.input ?? '').trim() !== '') || f.showAnswer))

export const selectVelocityStep2Complete = (s: RootState) => {
  const v: any = selectVelocity(s)
  return _filled(v.Gradient2) && _filled(v.Conductivity2) && _filled(v.Porosity2) && _filled(v.HorizontalVelocity)
}

const VELOCITY_ANSWER_KEYS = ['Gradient', 'Conductivity', 'Porosity', 'Gradient2', 'Conductivity2', 'Porosity2', 'HorizontalVelocity'] as const

export const VELOCITY_TOTAL_QUESTIONS = VELOCITY_ANSWER_KEYS.length

export const selectVelocityRightCount = (s: RootState) => {
  const v: any = selectVelocity(s)
  return VELOCITY_ANSWER_KEYS.filter((key) => v[key]?.isCorrect).length
}

const round2 = (x: number) => Math.round(x * 100) / 100

export const checkStep1 = (opts: { check?: boolean; show?: boolean } = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const gradient = computeGradientValue(s) ?? undefined
    const { conductivity, porosityFrac } = pickHydraulicPropsForHighWell(s)
    dispatch(checkStep1Applied({ gradient, conductivity, porosityFrac, check: opts.check, show: opts.show }))
  }

export const checkStep2 = (opts: { check?: boolean; show?: boolean } = {}) =>
  (dispatch: any, getState: () => RootState) => {
    const s = getState()
    const gradient = computeGradientValue(s) ?? undefined
    const { conductivity, porosityFrac } = pickHydraulicPropsForHighWell(s)
    const hv = (gradient != null && conductivity != null && porosityFrac) ? round2((gradient * conductivity) / porosityFrac) : undefined
    dispatch(checkStep2Applied({ gradient, conductivity, porosityFrac, hv, check: opts.check, show: opts.show }))
  }