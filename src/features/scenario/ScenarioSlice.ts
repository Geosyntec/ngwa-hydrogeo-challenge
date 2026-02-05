import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type {
  ScenarioDefinition,
  ScenarioState,
  PanelKey,
} from "./scenarioTypes";

const initialState: ScenarioState = {
  isLoaded: false,
  hasBeenAttached: false,
  hasBeenComposed: false,
  isTest: false,
  scenarios: [],
  scenarioIndex: -1,
  title: "",
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
  teamName: "",
  testLocation: "",
  submitResultText: "",
  openWellPopoverId: null,
};

export const scenarioSlice = createSlice({
  name: "scenario",
  initialState,
  reducers: {
    setIsTest(s, a: PayloadAction<boolean>) {
      s.isTest = a.payload;
    },
    setScenarios(s, a: PayloadAction<ScenarioDefinition[]>) {
      s.scenarios = a.payload ?? [];
    },
    selectScenarioByIndex(s, a: PayloadAction<number>) {
      const idx = a.payload;
      s.scenarioIndex = idx;
      const d = s.scenarios[idx];
      if (!d) return;
      s.title = d.name;
      s.map = d.map;
      s.allowPumping = d.allowPumping;
      s.showCheckAnswerButton = d.showCheckAnswerButton;
      s.showSolutionButton = d.showSolutionButton;
      s.wells = d.wells;
      s.selectedWells = { one: null, two: null, three: null };
      s.distanceRatioFtPerPx = d.map
        ? (d.map.physicalWidth * 5280) / d.map.width
        : 0;
      s.allowCollapsing = false;
    },
    selectWell(s, a: PayloadAction<string>) {
      const id = a.payload;
      const used = Object.values(s.selectedWells).includes(id);
      if (used) return;
      const slot = !s.selectedWells.one
        ? "one"
        : !s.selectedWells.two
          ? "two"
          : !s.selectedWells.three
            ? "three"
            : null;
      if (slot) {
        (s.selectedWells as any)[slot] = id;
        const w = s.wells.find((w) => w.id === id);
        if (w) w.IsSelected = true;
      }
    },
    clearWell(s, a: PayloadAction<1 | 2 | 3>) {
      const slot = a.payload === 1 ? "one" : a.payload === 2 ? "two" : "three";
      const id = (s.selectedWells as any)[slot];
      if (id) {
        const w = s.wells.find((w) => w.id === id);
        if (w) w.IsSelected = false;
      }
      (s.selectedWells as any)[slot] = null;
    },
    setSelectedPanel(s, a: PayloadAction<PanelKey>) {
      s.selectedPanel = s.selectedPanel === a.payload ? null : a.payload;
    },
    setWellPumping(s, a: PayloadAction<{ id: string; on: boolean }>) {
      const w = s.wells.find((w) => w.id === a.payload.id);
      if (w) w.IsPumpingOn = a.payload.on;
    },
    setOpenWellPopover(s, a: PayloadAction<string | null>) {
      s.openWellPopoverId = a.payload;
    },
    setTeamName(s, a: PayloadAction<string>) {
      s.teamName = a.payload;
    },
    setTestLocation(s, a: PayloadAction<string>) {
      s.testLocation = a.payload;
    },
    setSubmitResultText(s, a: PayloadAction<string>) {
      s.submitResultText = a.payload;
    },
  },
});
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
} = scenarioSlice.actions;
export default scenarioSlice.reducer;

export const selectScenarioState = (s: RootState) => s.scenario;
export const selectMap = (s: RootState) => s.scenario.map;
export const selectWells = (s: RootState) => s.scenario.wells;
export const selectWellById = (id: string) =>
  createSelector(selectWells, (ws) => ws.find((w) => w.id === id) || null);
export const selectSelectedWellIds = (s: RootState) => s.scenario.selectedWells;
export const selectAllWellsSelected = createSelector(
  selectSelectedWellIds,
  (sel) => !!sel.one && !!sel.two && !!sel.three,
);
