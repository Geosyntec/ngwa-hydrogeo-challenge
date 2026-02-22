import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
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
import { verifyStudent } from "../../api/mockVerifyStudentApi";

import MapView from "./components/MapView/MapView";
import ChooseWellsPanel from "./components/Panels/ChooseWellsPanel";
import FlowDirectionPanel from "./components/Panels/FlowDirectionPanel/FlowDirectionPanel";
import GradientPanel from "./components/Panels/GradientPanel/GradientPanel";
import HorizontalVelocityPanel from "./components/Panels/HorizontalVelocityPanel/HorizontalVelocityPanel";

export default function Scenario({ isTest = false }: { isTest?: boolean }) {
  const dispatch = useAppDispatch();
  const { scenarios, scenarioIndex } = useAppSelector(selectScenarioState);

  const [verified, setVerified] = useState(false);
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    dispatch(setIsTest(!!isTest));
  }, [isTest, dispatch]);

  useEffect(() => {
    const list = isTest ? [testScenario] : practiceScenarios;
    dispatch(setScenarios(list));
    dispatch(selectScenarioByIndex(0));
  }, [isTest, dispatch]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    const c = className.trim();
    const s = studentName.trim();
    if (!c || !s) {
      setVerifyError("Please enter both class name and student name.");
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await verifyStudent({ className: c, studentName: s });
      if (res.ok) {
        setVerified(true);
      } else {
        setVerifyError(res.message ?? "That student cannot be verified.");
      }
    } catch {
      setVerifyError("Verification failed. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const currentScenario = scenarios[scenarioIndex];
  const scenarioValue = scenarioIndex >= 0 ? scenarioIndex : "";

  const showVerifyModal = isTest && !verified;

  return (
    <>
      <Dialog
        open={showVerifyModal}
        onClose={() => {}}
        disableEscapeKeyDown
        PaperProps={{
          sx: { minWidth: 320 },
        }}
      >
        <DialogTitle>Verify your identity</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your class name and student name to start the test.
          </Typography>
          <Box
            component="form"
            id="verify-student-form"
            onSubmit={handleVerify}
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0 }}
          >
            <TextField
              autoFocus
              label="Class name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              fullWidth
              size="small"
              required
            />
            {verifyError && (
              <Typography color="error" variant="body2">
                {verifyError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="submit"
            form="verify-student-form"
            variant="contained"
            disabled={verifyLoading}
          >
            {verifyLoading ? "Verifying…" : "Verify ID and start test"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
