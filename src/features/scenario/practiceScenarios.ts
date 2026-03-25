import type { ScenarioDefinition } from "./scenarioTypes";

/**
 * Practice scenarios: list of scenarios available in practice mode.
 * Users can select from these in the scenario dropdown.
 */
export const practiceScenarios: ScenarioDefinition[] = [
  {
    id: "demo-1",
    name: "Demo Scenario",
    map: { url: "", width: 800, height: 600, physicalWidth: 1 },
    allowPumping: true,
    showCheckAnswerButton: true,
    showSolutionButton: true,
    wells: [
      {
        id: "A",
        Name: "A",
        Elevation: 105,
        GroundElevationFt: 110,
        StaticElevationFt: 108,
        PumpingElevationFt: 103,
        IsPumpingOn: false,
        IsSelected: false,
        IsCollapsed: true,
        Top: 120,
        Left: 300,
        Point: { x: 300, y: 120 },
        GeologyNew: [
          { depthFt: 0, lithology: "sand", conductivityK: 50, porosityPct: 25 },
        ],
      },
      {
        id: "B",
        Name: "B",
        Elevation: 100,
        GroundElevationFt: 106,
        StaticElevationFt: 102,
        PumpingElevationFt: 97,
        IsPumpingOn: false,
        IsSelected: false,
        IsCollapsed: true,
        Top: 300,
        Left: 100,
        Point: { x: 100, y: 300 },
        GeologyNew: [
          { depthFt: 0, lithology: "sand", conductivityK: 40, porosityPct: 22 },
        ],
      },
      {
        id: "C",
        Name: "C",
        Elevation: 98,
        GroundElevationFt: 104,
        StaticElevationFt: 99,
        PumpingElevationFt: 94,
        IsPumpingOn: false,
        IsSelected: false,
        IsCollapsed: true,
        Top: 420,
        Left: 520,
        Point: { x: 520, y: 420 },
        GeologyNew: [
          { depthFt: 0, lithology: "sand", conductivityK: 30, porosityPct: 20 },
        ],
      },
      {
        id: "D",
        Name: "D",
        Elevation: 105,
        GroundElevationFt: 100,
        StaticElevationFt: 95,
        PumpingElevationFt: 92,
        IsPumpingOn: false,
        IsSelected: false,
        IsCollapsed: true,
        Top: 450,
        Left: 300,
        Point: { x: 300, y: 450 },
        GeologyNew: [
          { depthFt: 0, lithology: "sand", conductivityK: 50, porosityPct: 25 },
        ],
      },
    ],
  },
];
