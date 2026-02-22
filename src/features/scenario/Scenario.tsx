import { useEffect } from "react";
import {
  Box,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setIsTest,
  setScenarios,
  selectScenarioByIndex,
  selectScenarioState,
} from "./ScenarioSlice";
import { practiceScenarios } from "./practiceScenarios";
import { testScenario } from "./testScenario";

import MapView from "./components/MapView/MapView";
import ChooseWellsPanel from "./components/Panels/ChooseWellsPanel";
import FlowDirectionPanel from "./components/Panels/FlowDirectionPanel/FlowDirectionPanel";
import GradientPanel from "./components/Panels/GradientPanel/GradientPanel";
import HorizontalVelocityPanel from "./components/Panels/HorizontalVelocityPanel/HorizontalVelocityPanel";

export default function Scenario({ isTest = false }: { isTest?: boolean }) {
  const dispatch = useAppDispatch();
  const { scenarios, scenarioIndex } = useAppSelector(selectScenarioState);

  useEffect(() => {
    dispatch(setIsTest(!!isTest));
  }, [isTest, dispatch]);

  useEffect(() => {
    const list = isTest ? [testScenario] : practiceScenarios;
    dispatch(setScenarios(list));
    dispatch(selectScenarioByIndex(0));
  }, [isTest, dispatch]);

  const currentScenario = scenarios[scenarioIndex];
  const scenarioValue = scenarioIndex >= 0 ? scenarioIndex : "";

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <Select
            value={scenarioValue}
            onChange={(e) => dispatch(selectScenarioByIndex(Number(e.target.value)))}
            displayEmpty
            renderValue={() =>
              currentScenario ? currentScenario.name : "Select a scenario"
            }
          >
            {scenarios.map((s, i) => (
              <MenuItem key={s.id} value={i}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selecting a new scenario will reset the challenge and all progress will be lost.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <MapView />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChooseWellsPanel />
          <FlowDirectionPanel />
          <GradientPanel />
          <HorizontalVelocityPanel />
        </Grid>
      </Grid>
    </Container>
  );
}
