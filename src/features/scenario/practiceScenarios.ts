import type { ScenarioDefinition } from "./scenarioTypes";

/**
 * Practice scenarios (legacy Hydrogeology Challenge content).
 * Map images live under `public/MapImages/` (same paths as `map.url`).
 */
export const practiceScenarios: ScenarioDefinition[] = [
  {
    "id": "9a8b1d9f-387d-4b14-910a-d0d104c7cd47",
    "name": "001-Choose Your Map: River Heights",
    "map": {
      "url": "/MapImages/9a8b1d9f-387d-4b14-910a-d0d104c7cd47.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 10
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 2519,
        "GroundElevationFt": 2529,
        "StaticElevationFt": 2519,
        "PumpingElevationFt": 2499,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 82,
        "Left": 666,
        "Point": {
          "x": 666,
          "y": 82
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
        "Elevation": 2566,
        "GroundElevationFt": 2630,
        "StaticElevationFt": 2566,
        "PumpingElevationFt": 2546,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 200,
        "Left": 989,
        "Point": {
          "x": 989,
          "y": 200
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
        "Elevation": 2591,
        "GroundElevationFt": 2654,
        "StaticElevationFt": 2591,
        "PumpingElevationFt": 2576,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 290,
        "Left": 869,
        "Point": {
          "x": 869,
          "y": 290
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
        "Elevation": 2507,
        "GroundElevationFt": 2575,
        "StaticElevationFt": 2507,
        "PumpingElevationFt": 2467,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 326,
        "Left": 583,
        "Point": {
          "x": 583,
          "y": 326
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
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 33
          },
          {
            "depthFt": 38,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 65,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 112,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 165,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 2485,
        "GroundElevationFt": 2536,
        "StaticElevationFt": 2485,
        "PumpingElevationFt": 2460,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 491,
        "Left": 814,
        "Point": {
          "x": 814,
          "y": 491
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
            "porosityPct": 46
          },
          {
            "depthFt": 25,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 70,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 105,
            "lithology": "Medium sand",
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
        "Left": 648,
        "Point": {
          "x": 648,
          "y": 610
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 10,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 75,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 155,
            "lithology": "Sandstone",
            "conductivityK": 26.8,
            "porosityPct": 33
          }
        ]
      },
      {
        "id": "G",
        "Name": "G",
        "Elevation": 2393,
        "GroundElevationFt": 2513,
        "StaticElevationFt": 2393,
        "PumpingElevationFt": 2371,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 644,
        "Left": 967,
        "Point": {
          "x": 967,
          "y": 644
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 4,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 44,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          },
          {
            "depthFt": 98,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          }
        ]
      }
    ]
  },
  {
    "id": "e8521e4b-e25a-4481-8aaf-d0a74db677cc",
    "name": "002 -  Filmore Grove",
    "map": {
      "url": "/MapImages/e8521e4b-e25a-4481-8aaf-d0a74db677cc.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 4.5
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 1543,
        "GroundElevationFt": 1566,
        "StaticElevationFt": 1543,
        "PumpingElevationFt": 1517,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 45,
        "Left": 998,
        "Point": {
          "x": 998,
          "y": 45
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 4,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 7,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 101,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 157,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 222,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 287,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 1574,
        "GroundElevationFt": 1614,
        "StaticElevationFt": 1574,
        "PumpingElevationFt": 1557,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 198,
        "Left": 614,
        "Point": {
          "x": 614,
          "y": 198
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 1,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 62,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 160,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 171,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "C",
        "Name": "C",
        "Elevation": 1589,
        "GroundElevationFt": 1615,
        "StaticElevationFt": 1589,
        "PumpingElevationFt": 1555,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 342,
        "Left": 828,
        "Point": {
          "x": 828,
          "y": 342
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 2,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 79,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 105,
            "lithology": "Till",
            "conductivityK": 0.01,
            "porosityPct": 34
          },
          {
            "depthFt": 140,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 221,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 291,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 322,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 396,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 1577,
        "GroundElevationFt": 1650,
        "StaticElevationFt": 1577,
        "PumpingElevationFt": 1568,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 639,
        "Left": 743,
        "Point": {
          "x": 743,
          "y": 639
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 24,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 30,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 43,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 52,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 69,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 1612,
        "GroundElevationFt": 1676,
        "StaticElevationFt": 1612,
        "PumpingElevationFt": 1592,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 595,
        "Left": 943,
        "Point": {
          "x": 943,
          "y": 595
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 4,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 46,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 56,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 82,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 151,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 163,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 255,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      }
    ]
  },
  {
    "id": "6b99a6cc-c763-4f44-9c54-c4c997e22586",
    "name": "003 - Filmore City",
    "map": {
      "url": "/MapImages/6b99a6cc-c763-4f44-9c54-c4c997e22586.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 6
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 1580,
        "GroundElevationFt": 1640,
        "StaticElevationFt": 1580,
        "PumpingElevationFt": 1543,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 149,
        "Left": 785,
        "Point": {
          "x": 785,
          "y": 149
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 152,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 284,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 294,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 359,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 384,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 1477,
        "GroundElevationFt": 1550,
        "StaticElevationFt": 1477,
        "PumpingElevationFt": 1468,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 283,
        "Left": 599,
        "Point": {
          "x": 599,
          "y": 283
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 24,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 30,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 43,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 52,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 69,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "C",
        "Name": "C",
        "Elevation": 1613,
        "GroundElevationFt": 1647,
        "StaticElevationFt": 1613,
        "PumpingElevationFt": 1586,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 273,
        "Left": 990,
        "Point": {
          "x": 990,
          "y": 273
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 2,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 30,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 40,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 105,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 227,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 302,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 1538,
        "GroundElevationFt": 1572,
        "StaticElevationFt": 1538,
        "PumpingElevationFt": 1516,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 524,
        "Left": 703,
        "Point": {
          "x": 703,
          "y": 524
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 1,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 35,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 200,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 218,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 1574,
        "GroundElevationFt": 1614,
        "StaticElevationFt": 1574,
        "PumpingElevationFt": 1557,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 606,
        "Left": 924,
        "Point": {
          "x": 924,
          "y": 606
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 1,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 62,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 160,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 171,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      }
    ]
  },
  {
    "id": "29795340-493b-4930-989e-621a47966e4c",
    "name": "004 - Filmore Springs",
    "map": {
      "url": "/MapImages/29795340-493b-4930-989e-621a47966e4c.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 4.5
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 1546,
        "GroundElevationFt": 1589,
        "StaticElevationFt": 1546,
        "PumpingElevationFt": 1524,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 129,
        "Left": 594,
        "Point": {
          "x": 594,
          "y": 129
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 30,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 96,
            "lithology": "Till",
            "conductivityK": 0.01,
            "porosityPct": 34
          },
          {
            "depthFt": 119,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 156,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 266,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 1612,
        "GroundElevationFt": 1676,
        "StaticElevationFt": 1612,
        "PumpingElevationFt": 1592,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 69,
        "Left": 898,
        "Point": {
          "x": 898,
          "y": 69
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 4,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 46,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 56,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 82,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 151,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 163,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 255,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "C",
        "Name": "C",
        "Elevation": 1580,
        "GroundElevationFt": 1640,
        "StaticElevationFt": 1580,
        "PumpingElevationFt": 1543,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 233,
        "Left": 770,
        "Point": {
          "x": 770,
          "y": 233
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 152,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 284,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 294,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 359,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 384,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 1447,
        "GroundElevationFt": 1550,
        "StaticElevationFt": 1447,
        "PumpingElevationFt": 1468,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 310,
        "Left": 592,
        "Point": {
          "x": 592,
          "y": 310
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 3,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 24,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 30,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 43,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 52,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 69,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 1543,
        "GroundElevationFt": 1566,
        "StaticElevationFt": 1543,
        "PumpingElevationFt": 1517,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 461,
        "Left": 915,
        "Point": {
          "x": 915,
          "y": 461
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 4,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 7,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 101,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 157,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 222,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 287,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "F",
        "Name": "F",
        "Elevation": 1589,
        "GroundElevationFt": 1615,
        "StaticElevationFt": 1589,
        "PumpingElevationFt": 1555,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 572,
        "Left": 702,
        "Point": {
          "x": 702,
          "y": 572
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 2,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 79,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 105,
            "lithology": "Till",
            "conductivityK": 0.01,
            "porosityPct": 34
          },
          {
            "depthFt": 140,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 221,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 291,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 322,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 396,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "G",
        "Name": "G",
        "Elevation": 1574,
        "GroundElevationFt": 1614,
        "StaticElevationFt": 1574,
        "PumpingElevationFt": 1557,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 585,
        "Left": 835,
        "Point": {
          "x": 835,
          "y": 585
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 1,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 62,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 160,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 171,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      }
    ]
  },
  {
    "id": "d58f4add-de38-4494-965f-e144f8a46784",
    "name": "005 - High Plains Aquifer",
    "map": {
      "url": "/MapImages/d58f4add-de38-4494-965f-e144f8a46784.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 8
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 1435,
        "GroundElevationFt": 1555,
        "StaticElevationFt": 1435,
        "PumpingElevationFt": 1425,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 69,
        "Left": 928,
        "Point": {
          "x": 928,
          "y": 69
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
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 1433,
        "GroundElevationFt": 1497,
        "StaticElevationFt": 1433,
        "PumpingElevationFt": 1413,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 159,
        "Left": 648,
        "Point": {
          "x": 648,
          "y": 159
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
            "lithology": "Sandstone",
            "conductivityK": 26.8,
            "porosityPct": 33
          },
          {
            "depthFt": 72,
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
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
        "Elevation": 1441,
        "GroundElevationFt": 1504,
        "StaticElevationFt": 1441,
        "PumpingElevationFt": 1426,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 295,
        "Left": 829,
        "Point": {
          "x": 829,
          "y": 295
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
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 1418,
        "GroundElevationFt": 1486,
        "StaticElevationFt": 1418,
        "PumpingElevationFt": 1398,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 454,
        "Left": 707,
        "Point": {
          "x": 707,
          "y": 454
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
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 33
          },
          {
            "depthFt": 38,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 65,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 112,
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
          },
          {
            "depthFt": 165,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 1428,
        "GroundElevationFt": 1484,
        "StaticElevationFt": 1428,
        "PumpingElevationFt": 1408,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 550,
        "Left": 900,
        "Point": {
          "x": 900,
          "y": 550
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
            "porosityPct": 46
          },
          {
            "depthFt": 25,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 70,
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
          },
          {
            "depthFt": 105,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          }
        ]
      },
      {
        "id": "F",
        "Name": "F",
        "Elevation": 1368,
        "GroundElevationFt": 1493,
        "StaticElevationFt": 1368,
        "PumpingElevationFt": 1363,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 611,
        "Left": 599,
        "Point": {
          "x": 599,
          "y": 611
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Fine sand",
            "conductivityK": 26.8,
            "porosityPct": 43
          },
          {
            "depthFt": 10,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 55,
            "lithology": "Coarse sand & gravel",
            "conductivityK": 160.8,
            "porosityPct": 34
          },
          {
            "depthFt": 135,
            "lithology": "Sandstone",
            "conductivityK": 26.8,
            "porosityPct": 33
          }
        ]
      }
    ]
  },
  {
    "id": "8eed0d68-1120-4a95-9ded-da9eaf556b0f",
    "name": "006 - Peoria",
    "map": {
      "url": "/MapImages/8eed0d68-1120-4a95-9ded-da9eaf556b0f.jpg",
      "width": 1024,
      "height": 685,
      "physicalWidth": 0.6
    },
    "allowPumping": true,
    "showCheckAnswerButton": true,
    "showSolutionButton": true,
    "wells": [
      {
        "id": "A",
        "Name": "A",
        "Elevation": 1445,
        "GroundElevationFt": 1466,
        "StaticElevationFt": 1445,
        "PumpingElevationFt": 1443,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 215,
        "Left": 586,
        "Point": {
          "x": 586,
          "y": 215
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 10,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 13,
            "lithology": "Silty sand",
            "conductivityK": 6.7,
            "porosityPct": 44
          },
          {
            "depthFt": 28,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 55,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "B",
        "Name": "B",
        "Elevation": 1449,
        "GroundElevationFt": 1468,
        "StaticElevationFt": 1449,
        "PumpingElevationFt": 1446,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 234,
        "Left": 875,
        "Point": {
          "x": 875,
          "y": 234
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Till",
            "conductivityK": 0.01,
            "porosityPct": 34
          },
          {
            "depthFt": 10,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 25,
            "lithology": "Medium sand",
            "conductivityK": 67,
            "porosityPct": 39
          },
          {
            "depthFt": 57,
            "lithology": "Medium sand & gravel",
            "conductivityK": 103.8,
            "porosityPct": 36
          },
          {
            "depthFt": 95,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 125,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "C",
        "Name": "C",
        "Elevation": 1453,
        "GroundElevationFt": 1470,
        "StaticElevationFt": 1453,
        "PumpingElevationFt": 1450,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 361,
        "Left": 762,
        "Point": {
          "x": 762,
          "y": 361
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Topsoil",
            "conductivityK": 2.68,
            "porosityPct": 52
          },
          {
            "depthFt": 2,
            "lithology": "Coarse sand",
            "conductivityK": 80.4,
            "porosityPct": 39
          },
          {
            "depthFt": 15,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 21,
            "lithology": "Fine sand & gravel",
            "conductivityK": 88.4,
            "porosityPct": 39
          },
          {
            "depthFt": 80,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 175,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "D",
        "Name": "D",
        "Elevation": 1456,
        "GroundElevationFt": 1477,
        "StaticElevationFt": 1456,
        "PumpingElevationFt": 1454,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 538,
        "Left": 910,
        "Point": {
          "x": 910,
          "y": 538
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 16,
            "lithology": "Till",
            "conductivityK": 0.01,
            "porosityPct": 34
          },
          {
            "depthFt": 18,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 30,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 110,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      },
      {
        "id": "E",
        "Name": "E",
        "Elevation": 1459,
        "GroundElevationFt": 1480,
        "StaticElevationFt": 1459,
        "PumpingElevationFt": 1457,
        "IsPumpingOn": false,
        "IsSelected": false,
        "IsCollapsed": true,
        "Top": 611,
        "Left": 686,
        "Point": {
          "x": 686,
          "y": 611
        },
        "GeologyNew": [
          {
            "depthFt": 0,
            "lithology": "Silt",
            "conductivityK": 4.02,
            "porosityPct": 46
          },
          {
            "depthFt": 1,
            "lithology": "Silty clay",
            "conductivityK": 1.34,
            "porosityPct": 44
          },
          {
            "depthFt": 10,
            "lithology": "Clay",
            "conductivityK": 0.01,
            "porosityPct": 42
          },
          {
            "depthFt": 33,
            "lithology": "Gravel",
            "conductivityK": 241.2,
            "porosityPct": 32
          },
          {
            "depthFt": 82,
            "lithology": "Shale",
            "conductivityK": 0,
            "porosityPct": 6
          }
        ]
      }
    ]
  }
]
