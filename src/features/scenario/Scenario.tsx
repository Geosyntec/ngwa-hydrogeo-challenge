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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setIsTest,
  setScenarios,
  setTestStudentId,
  selectScenarioByIndex,
  selectScenarioState,
} from "./ScenarioSlice";
import { dispatchResetChallenge } from "./resetChallengeState";
import { practiceScenarios } from "./practiceScenarios";
import { getTestScenarioById } from "./testScenario";
import { verifyStudent } from "../../api/mockVerifyStudentApi";
import {
  fetchClassesByTeacherId,
  fetchClassScenarioSubmittedStudentIds,
  fetchStudentsByClassId,
  studentDisplayName,
} from "../../api/classesApi";

import MapView from "./components/MapView/MapView";
import ChooseWellsPanel from "./components/Panels/ChooseWellsPanel";
import FlowDirectionPanel from "./components/Panels/FlowDirectionPanel/FlowDirectionPanel";
import GradientPanel from "./components/Panels/GradientPanel/GradientPanel";
import HorizontalVelocityPanel from "./components/Panels/HorizontalVelocityPanel/HorizontalVelocityPanel";
import { selectIsAuthenticated } from "../auth/authSlice";

type ClassOption = { id: string; name: string };

/** Fixed question column width from `md` up; does not shrink until layout stacks below `md`. */
const SCENARIO_QUESTION_PANEL_WIDTH_PX = 600;
/** Minimum map width on `md+` so the row triggers horizontal scroll instead of crushing columns. */
const SCENARIO_MAP_MIN_WIDTH_PX = 480;
/** Default MUI `spacing(2)` gap between columns (must match `gap: 2` below). */
const SCENARIO_ROW_GAP_PX = 16;
const SCENARIO_ROW_MIN_WIDTH_MD =
  SCENARIO_QUESTION_PANEL_WIDTH_PX +
  SCENARIO_ROW_GAP_PX +
  SCENARIO_MAP_MIN_WIDTH_PX;

export default function Scenario({
  isTest = false,
  teacherIdForTest,
  testId,
}: {
  isTest?: boolean;
  /** Teacher user UUID from `/test?teacherID=…`; enables roster Selects in verify modal. */
  teacherIdForTest?: string;
  /** Scenario id from `/test?testID=…`; empty uses default first test scenario. */
  testId?: string;
}) {
  const dispatch = useAppDispatch();
  const { scenarios, scenarioIndex } = useAppSelector(selectScenarioState);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  /** Signed-in users are teachers; they preview the test without student verification. */
  const isTeacherViewingTest = Boolean(isTest && isAuthenticated);

  const [verified, setVerified] = useState(false);
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const useRosterUi = Boolean(
    isTest && teacherIdForTest && !isAuthenticated,
  );
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [rosterStudents, setRosterStudents] = useState<
    Array<{ id: string; first_name: string; last_name: string }>
  >([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [submittedStudentIds, setSubmittedStudentIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [submissionsStatusLoading, setSubmissionsStatusLoading] =
    useState(false);
  const [submissionsStatusError, setSubmissionsStatusError] = useState<
    string | null
  >(null);

  useEffect(() => {
    dispatch(setIsTest(!!isTest));
  }, [isTest, dispatch]);

  useEffect(() => {
    if (!isTest) {
      dispatch(setScenarios(practiceScenarios));
      dispatch(selectScenarioByIndex(0));
      dispatchResetChallenge(dispatch);
      return;
    }
    const testDef = getTestScenarioById(testId);
    dispatch(setScenarios(testDef ? [testDef] : []));
    dispatch(selectScenarioByIndex(0));
    dispatchResetChallenge(dispatch);
  }, [isTest, testId, dispatch]);

  useEffect(() => {
    if (!useRosterUi || !teacherIdForTest || verified) return;
    let cancelled = false;
    setClassesLoading(true);
    setClassesError(null);
    fetchClassesByTeacherId(teacherIdForTest)
      .then((data) => {
        if (cancelled) return;
        const opts = Object.entries(data)
          .map(([name, v]) => ({ id: v.classId, name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setClassOptions(opts);
        if (opts.length === 0) {
          setClassesError("No classes found for this teacher link.");
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setClassesError(e.message ?? "Failed to load classes.");
      })
      .finally(() => {
        if (!cancelled) setClassesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useRosterUi, teacherIdForTest, verified]);

  useEffect(() => {
    if (!useRosterUi || !selectedClassId) {
      setRosterStudents([]);
      setStudentsError(null);
      return;
    }
    let cancelled = false;
    setStudentsLoading(true);
    setStudentsError(null);
    fetchStudentsByClassId(selectedClassId)
      .then((res) => {
        if (!cancelled) setRosterStudents(res.students);
      })
      .catch((e: Error) => {
        if (!cancelled) setStudentsError(e.message ?? "Failed to load students.");
      })
      .finally(() => {
        if (!cancelled) setStudentsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useRosterUi, selectedClassId]);

  useEffect(() => {
    if (!useRosterUi || !selectedClassId || !teacherIdForTest) {
      setSubmittedStudentIds(new Set());
      setSubmissionsStatusError(null);
      setSubmissionsStatusLoading(false);
      return;
    }
    const scenarioId = scenarios[scenarioIndex]?.id ?? "";
    if (!scenarioId) {
      setSubmittedStudentIds(new Set());
      return;
    }
    let cancelled = false;
    setSubmissionsStatusLoading(true);
    setSubmissionsStatusError(null);
    setSubmittedStudentIds(new Set());
    fetchClassScenarioSubmittedStudentIds(
      selectedClassId,
      scenarioId,
      teacherIdForTest,
    )
      .then((ids) => {
        if (!cancelled) setSubmittedStudentIds(new Set(ids));
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setSubmissionsStatusError(
            e.message ?? "Could not load who already submitted this test.",
          );
          setSubmittedStudentIds(new Set());
        }
      })
      .finally(() => {
        if (!cancelled) setSubmissionsStatusLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useRosterUi, selectedClassId, teacherIdForTest, scenarios[scenarioIndex]?.id]);

  useEffect(() => {
    if (selectedStudentId && submittedStudentIds.has(selectedStudentId)) {
      setSelectedStudentId("");
    }
  }, [submittedStudentIds, selectedStudentId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);

    if (useRosterUi) {
      if (!selectedClassId || !selectedStudentId) {
        setVerifyError("Please select a class and a student.");
        return;
      }
      setVerifyLoading(true);
      try {
        dispatch(setTestStudentId(selectedStudentId));
        setVerified(true);
      } finally {
        setVerifyLoading(false);
      }
      return;
    }

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
        if (res.studentId) dispatch(setTestStudentId(res.studentId));
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

  const showVerifyModal =
    isTest && !isTeacherViewingTest && !verified;
  const selectedAlreadySubmitted =
    Boolean(selectedStudentId) &&
    submittedStudentIds.has(selectedStudentId);
  const verifyDisabled =
    verifyLoading ||
    classesLoading ||
    (useRosterUi &&
      (!selectedClassId ||
        !selectedStudentId ||
        studentsLoading ||
        submissionsStatusLoading ||
        selectedAlreadySubmitted ||
        !!classesError ||
        !!studentsError ||
        !!submissionsStatusError));

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
            {useRosterUi
              ? "Select your class and your name to start the test. Anyone who already submitted this test for the selected class cannot be chosen again unless your teacher resets their submission."
              : "Enter your class name and student name to start the test."}
          </Typography>
          <Box
            component="form"
            id="verify-student-form"
            onSubmit={handleVerify}
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0 }}
          >
            {useRosterUi ? (
              <>
                {(classesError || studentsError || submissionsStatusError) && (
                  <Typography color="error" variant="body2">
                    {classesError ?? studentsError ?? submissionsStatusError}
                  </Typography>
                )}
                <FormControl fullWidth size="small" required disabled={classesLoading}>
                  <InputLabel id="verify-class-label">Class</InputLabel>
                  <Select
                    labelId="verify-class-label"
                    label="Class"
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value as string);
                      setSelectedStudentId("");
                    }}
                  >
                    {classOptions.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  size="small"
                  required
                  disabled={
                    !selectedClassId || studentsLoading || submissionsStatusLoading
                  }
                >
                  <InputLabel id="verify-student-label">Student name</InputLabel>
                  <Select
                    labelId="verify-student-label"
                    label="Student name"
                    value={selectedStudentId}
                    onChange={(e) =>
                      setSelectedStudentId(e.target.value as string)
                    }
                  >
                    {rosterStudents.map((s) => {
                      const done = submittedStudentIds.has(s.id);
                      return (
                        <MenuItem key={s.id} value={s.id} disabled={done}>
                          {studentDisplayName(s)}
                          {done ? " (already submitted)" : ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {classesLoading && (
                  <Typography variant="caption" color="text.secondary">
                    Loading classes…
                  </Typography>
                )}
                {selectedClassId && studentsLoading && (
                  <Typography variant="caption" color="text.secondary">
                    Loading students…
                  </Typography>
                )}
                {selectedClassId && !studentsLoading && submissionsStatusLoading && (
                  <Typography variant="caption" color="text.secondary">
                    Checking who has already submitted this test…
                  </Typography>
                )}
                {selectedClassId &&
                  !studentsLoading &&
                  rosterStudents.length === 0 &&
                  !studentsError && (
                    <Typography variant="caption" color="text.secondary">
                      No students in this class.
                    </Typography>
                  )}
              </>
            ) : (
              <>
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
              </>
            )}
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
            disabled={verifyDisabled}
          >
            {verifyLoading ? "Verifying…" : "Verify ID and start test"}
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="xl" sx={{ py: 2 }}>
       

        <Box
          sx={{
            width: "100%",
            overflowX: { xs: "visible", md: "auto" },
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: 2,
              flexWrap: { md: "nowrap" },
              minWidth: { xs: 0, md: SCENARIO_ROW_MIN_WIDTH_MD },
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: SCENARIO_QUESTION_PANEL_WIDTH_PX },
                minWidth: { xs: 0, md: SCENARIO_QUESTION_PANEL_WIDTH_PX },
                maxWidth: { xs: "100%", md: SCENARIO_QUESTION_PANEL_WIDTH_PX },
                flexShrink: { md: 0 },
                boxSizing: "border-box",
              }}
            >
               <Box sx={{ mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 240 }}>
                  <Select
                    value={scenarioValue}
                    onChange={(e) => {
                      dispatch(selectScenarioByIndex(Number(e.target.value)));
                      dispatchResetChallenge(dispatch);
                    }}
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
                  Selecting a new scenario will reset the challenge and all progress
                  will be lost.
                </Typography>
              </Box>
              <ChooseWellsPanel />
              <FlowDirectionPanel />
              <GradientPanel />
              <HorizontalVelocityPanel />
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "auto" },
                minWidth: { xs: 0, md: SCENARIO_MAP_MIN_WIDTH_PX },
                flex: { md: "1 1 auto" },
                flexShrink: { md: 0 },
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <MapView />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
