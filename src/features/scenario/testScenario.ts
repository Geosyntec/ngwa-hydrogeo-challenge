import type { ScenarioDefinition } from "./scenarioTypes";

/**
 * All published test scenarios (filtered by `testID` query on `/test`).
 * Add entries here as you add more tests.
 */
export const testScenarios: ScenarioDefinition[] = [
  {
    id: "Test-1",
    name: "Ashland",
    map: { url: "assets/img/river_heights_map.jpg", width: 800, height: 600, physicalWidth: 1 },
    allowPumping: true,
    showCheckAnswerButton: false,
    showSolutionButton: false,
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
        IsPumpingOn: true,
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

export const DEFAULT_TEST_SCENARIO_ID = testScenarios[0]?.id ?? "test-1";

/**
 * Resolve which test scenario to run.
 * - Empty `testId`: first scenario in `testScenarios` (default).
 * - Non-empty: match `ScenarioDefinition.id` (exact, then case-insensitive) so links stay
 *   valid if casing differs (e.g. `test-1` vs `Test-1`).
 */
export function getTestScenarioById(
  testId: string | undefined | null,
): ScenarioDefinition | undefined {
  const id = (testId ?? "").trim();
  if (!id) {
    return testScenarios[0];
  }
  const exact = testScenarios.find((s) => s.id === id);
  if (exact) return exact;
  const lower = id.toLowerCase();
  return testScenarios.find((s) => s.id.toLowerCase() === lower);
}

/** First test scenario; prefer `getTestScenarioById` / `testScenarios` for new code. */
export const testScenario = testScenarios[0]!;
