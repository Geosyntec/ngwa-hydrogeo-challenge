import type { RootState } from '../../../app/store'
import { selectVelocity as _selectVelocity, checkStep1Applied, checkStep2Applied } from './velocitySlice'
import { computeGradientValue, pickHydraulicPropsForHighWell } from '../services/drawingMath'

export const selectVelocity = (s: RootState) => _selectVelocity(s)

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