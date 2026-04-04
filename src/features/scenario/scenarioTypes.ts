export interface WellPoint {
  x: number;
  y: number;
}
export interface GeologyRow {
  depthFt: number;
  lithology: string;
  conductivityK?: number;
  porosityPct?: number;
}
export interface WellModel {
  id: string;
  Name: string;
  Elevation: number;
  GroundElevationFt: number;
  StaticElevationFt: number;
  PumpingElevationFt: number;
  IsPumpingOn: boolean;
  IsSelected: boolean;
  IsCollapsed: boolean;
  Top: number;
  Left: number;
  Point: WellPoint;
  Geology?: any[];
  GeologyNew?: GeologyRow[];
}
export interface ScenarioMap {
  url: string;
  width: number;
  height: number;
  physicalWidth: number;
}
export interface ScenarioDefinition {
  id: string;
  name: string;
  map: ScenarioMap;
  allowPumping: boolean;
  showCheckAnswerButton: boolean;
  showSolutionButton: boolean;
  wells: WellModel[];
}
export type PanelKey = "flow" | "gradient" | "velocity" | null;
export interface ScenarioState {
  isLoaded: boolean;
  hasBeenAttached: boolean;
  hasBeenComposed: boolean;
  isTest: boolean;
  scenarios: ScenarioDefinition[];
  scenarioIndex: number;
  title: string;
  map: ScenarioMap | null;
  allowPumping: boolean;
  allowCollapsing: boolean;
  wells: WellModel[];
  selectedWells: {
    one: string | null;
    two: string | null;
    three: string | null;
  };
  sortedWells: string[];
  wellsVertSorted: string[];
  wellsHorizSorted: string[];
  distanceRatioFtPerPx: number;
  showCheckAnswerButton: boolean;
  showSolutionButton: boolean;
  selectedPanel: PanelKey;
  teamName: string;
  testLocation: string;
  submitResultText: string;
  openWellPopoverId: string | null;
  /** Roster / verify-student UUID; required to POST grade_submissions for tests. */
  testStudentId: string | null;
}
