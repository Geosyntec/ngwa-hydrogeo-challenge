import { useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setIsTest,
  setScenarios,
  selectScenarioByIndex,
  selectScenarioState,
  setSelectedPanel,
} from "./ScenarioSlice";

import MapView from "./components/MapView/MapView";
import ChooseWellsPanel from "./components/Panels/ChooseWellsPanel";
import FlowDirectionPanel from "./components/Panels/FlowDirectionPanel/FlowDirectionPanel";
import GradientPanel from "./components/Panels/GradientPanel/GradientPanel";
import HorizontalVelocityPanel from "./components/Panels/HorizontalVelocityPanel/HorizontalVelocityPanel";

export default function Scenario() {
  const dispatch = useAppDispatch();
  const { title } = useAppSelector(selectScenarioState);

  useEffect(() => {
    //TODO: Pull scenario from API 
    const demo = {
      id: "demo-1",
      name: "Demo Scenario",
      map: { url: "", width: 800, height: 600, physicalWidth: 1 }, //url:"./assets/img/map.jpeg"
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
            {
              depthFt: 0,
              lithology: "sand",
              conductivityK: 50,
              porosityPct: 25,
            },
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
            {
              depthFt: 0,
              lithology: "sand",
              conductivityK: 40,
              porosityPct: 22,
            },
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
            {
              depthFt: 0,
              lithology: "sand",
              conductivityK: 30,
              porosityPct: 20,
            },
          ],
        },
      ],
    };
    dispatch(setIsTest(false));
    dispatch(setScenarios([demo] as any));
    dispatch(selectScenarioByIndex(0));
    dispatch(setSelectedPanel("flow"));
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title || "Scenario"}
      </Typography>

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
