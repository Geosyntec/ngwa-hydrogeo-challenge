import type { ScenarioDefinition } from "./scenarioTypes";

/**
 * All published test scenarios (filtered by `testID` query on `/test`).
 * Add entries here as you add more tests.
 */
export const testScenarios: ScenarioDefinition[] = [
  {
    "id": "9a8b1d9f-387d-4b14-910a-d0d104c7cd47",
    "name": "Ashland",
    "map": {
      "url": "assets/img/ashland_map_cropped.jpg",
      "width": 782,
      "height": 640,
      "physicalWidth": 10
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 2615,
        "GroundElevationFt": 2615,
        "StaticElevationFt": 2595,
        "PumpingElevationFt": 2575,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 170,
        "Left": 620,
        "Point": {
          "x": 620,
          "y": 170
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 25,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 55,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 93,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 2700,
        "GroundElevationFt": 2700,
        "StaticElevationFt": 2636,
        "PumpingElevationFt": 2616,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 400,
        "Left": 260,
        "Point": {
          "x": 260,
          "y": 400
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 15,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 48,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          },
          {
            "depthFt": 72,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 88,
            "lithology": "Sandstone",
            "conductivityK": 26.8,
            "porosityPct": 33
          }
        ]
      },
      {
        "id": "C",
        "Name": "C",
        "Elevation": 2650,
        "GroundElevationFt": 2650,
        "StaticElevationFt": 2591,
        "PumpingElevationFt": 2576,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 240,
        "Left": 70,
        "Point": {
          "x": 70,
          "y": 240
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 5,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 50,
            "lithology": "Sandstone",
            "conductivityK": 26.8,
            "porosityPct": 33
          },
          {
            "depthFt": 72,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 2605,
        "GroundElevationFt": 2605,
        "StaticElevationFt": 2525,
        "PumpingElevationFt": 2505,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 326,
        "Left": 83,
        "Point": {
          "x": 390,
          "y": 50
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 3,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 36
          },
          {
            "depthFt": 25,
            "lithology": "Silty Sand",
            "conductivityK": 6.70,
            "porosityPct": 44
          },
          {
            "depthFt": 75,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 100,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 2645,
        "GroundElevationFt": 2645,
        "StaticElevationFt": 2629,
        "PumpingElevationFt": 2603,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 491,
        "Left": 314,
        "Point": {
          "x": 650,
          "y": 600
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Fine Sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 10,
            "lithology": "Silty Sand",
            "conductivityK": 6.70,
            "porosityPct": 44
          },
          {
            "depthFt": 75,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 95,
            "lithology": "Medium Sand",
            "conductivityK": 67,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "F",
        "Name": "F",
        "Elevation": 2381,
        "GroundElevationFt": 2506,
        "StaticElevationFt": 2381,
        "PumpingElevationFt": 2356,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 610,
        "Left": 148,
        "Point": {
          "x": 380,
          "y": 240
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 15,
            "lithology": "Fine Sand",
            "conductivityK": 26.8,
            "porosityPct": 33
          },
          {
            "depthFt": 38,
            "lithology": "Silty Sand",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 65,
            "lithology": "Sandstone",
            "conductivityK": 6.70,
            "porosityPct": 44
          },
          {
            "depthFt": 92,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          }
        ]
      }
    ]
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
