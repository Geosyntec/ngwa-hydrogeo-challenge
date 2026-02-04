import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { ScenarioDefinition, ScenarioState, PanelKey } from './scenarioTypes'

const initialState: ScenarioState = {
  isLoaded: false,
  hasBeenAttached: false,
  hasBeenComposed: false,
  isTest: false,

  scenarios: [],
  scenarioIndex: -1,

  title: '',
  map: null,
  allowPumping: false,
  allowCollapsing: false,

  wells: [],
  selectedWells: { one: null, two: null, three: null },
  sortedWells: [],
  wellsVertSorted: [],
  wellsHorizSorted: [],

  distanceRatioFtPerPx: 0,

  showCheckAnswerButton: false,
  showSolutionButton: false,

  selectedPanel: null,

  teamName: '',
  testLocation: '',
  submitResultText: '',

  flowDirection: {},
  gradient: {},
  horizontalVelocity: {},

  openWellPopoverId: null,
}

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    setIsTest(state, action: PayloadAction<boolean>) {
      state.isTest = action.payload
    },
    setScenarios(state, action: PayloadAction<ScenarioDefinition[]>) {
      state.scenarios = action.payload ?? []
    },
    selectScenarioByIndex(state, action: PayloadAction<number>) {
      const idx = action.payload
      state.scenarioIndex = idx
      const s = state.scenarios[idx]
      if (!s) return
      state.title = s.name
      state.map = s.map
      state.allowPumping = s.allowPumping
      state.showCheckAnswerButton = s.showCheckAnswerButton
      state.showSolutionButton = s.showSolutionButton
      state.wells = s.wells
      state.selectedWells = { one: null, two: null, three: null }
      state.sortedWells = []
      state.wellsVertSorted = []
      state.wellsHorizSorted = []
      state.distanceRatioFtPerPx = s.map ? (s.map.physicalWidth * 5280) / s.map.width : 0
      state.allowCollapsing = false
    },
    selectWell(state, action: PayloadAction<string>) {
      const id = action.payload
      const already = Object.values(state.selectedWells).includes(id)
      if (already) return
      const slot = !state.selectedWells.one ? 'one' : !state.selectedWells.two ? 'two' : !state.selectedWells.three ? 'three' : null
      if (slot) {
        ;(state.selectedWells as any)[slot] = id
        const w = state.wells.find(w => w.id === id)
        if (w) w.IsSelected = true
      }
    },
    clearWell(state, action: PayloadAction<1 | 2 | 3>) {
      const slot = action.payload === 1 ? 'one' : action.payload === 2 ? 'two' : 'three'
      const id = state.selectedWells[slot as 'one'|'two'|'three']
      if (id) {
        const w = state.wells.find(w => w.id === id)
        if (w) w.IsSelected = false
      }
      ;(state.selectedWells as any)[slot] = null
    },
    setSelectedPanel(state, action: PayloadAction<PanelKey>) {
      const vm = action.payload
      state.selectedPanel = state.selectedPanel === vm ? null : vm
    },
    setWellPumping(state, action: PayloadAction<{ id: string; on: boolean }>) {
      const { id, on } = action.payload
      const w = state.wells.find(w => w.id === id)
      if (w) w.IsPumpingOn = on
    },
    setOpenWellPopover(state, action: PayloadAction<string | null>) {
      state.openWellPopoverId = action.payload
    },
    setTeamName(state, action: PayloadAction<string>) { state.teamName = action.payload },
    setTestLocation(state, action: PayloadAction<string>) { state.testLocation = action.payload },
    setSubmitResultText(state, action: PayloadAction<string>) { state.submitResultText = action.payload },
  }
})

export const {
  setIsTest,
  setScenarios,
  selectScenarioByIndex,
  selectWell,
  clearWell,
  setSelectedPanel,
  setWellPumping,
  setOpenWellPopover,
  setTeamName,
  setTestLocation,
  setSubmitResultText,
} = scenarioSlice.actions

export default scenarioSlice.reducer

// Selectors
export const selectScenarioState = (s: RootState) => s.scenario
export const selectMap = (s: RootState) => s.scenario.map
export const selectWells = (s: RootState) => s.scenario.wells

export const selectWellById = (id: string) =>
  createSelector(selectWells, wells => wells.find(w => w.id === id) || null)

export const selectSelectedWellIds = (s: RootState) => s.scenario.selectedWells

export const selectAllWellsSelected = createSelector(
  selectSelectedWellIds,
  (sel) => !!sel.one && !!sel.two && !!sel.three
)

export const selectDistanceRatioFtPerPx = (s: RootState) => s.scenario.distanceRatioFtPerPx

export const selectSelectedWellLetters = createSelector(
  selectSelectedWellIds,
  selectWells,
  (sel, wells) => {
    const byId = (id: string | null) => wells.find(w => w.id === id)?.Name ?? ''
    return [byId(sel.one), byId(sel.two), byId(sel.three)].filter(Boolean) as string[]
  }
)
