import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ContentCopy from "@mui/icons-material/ContentCopy";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { ROUTES, testHrefWithTeacherId } from "../../app/routes";
import { fetchClasses, type ClassesResponse } from "../../api/classesApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSlice";
import { testScenarios } from "../../features/scenario/testScenario";
import { resolvePublicAssetUrl } from "../../utils/publicAssetUrl";

function absoluteTestLink(teacherId: string, testId: string): string {
  const pathAndQuery = testHrefWithTeacherId(teacherId, testId);
  const path = resolvePublicAssetUrl(pathAndQuery);
  return `${window.location.origin}${path}`;
}

export default function CreateTestPage() {
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const teacherEmail = (authUser?.name ?? "").trim();
  const teacherId = (authUser?.id ?? "").trim();

  const [classesData, setClassesData] = useState<ClassesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTestByClassId, setSelectedTestByClassId] = useState<
    Record<string, string>
  >({});
  const [copySnackbar, setCopySnackbar] = useState(false);

  const loadClasses = useCallback(() => {
    if (!teacherEmail) {
      setClassesData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    fetchClasses(teacherEmail)
      .then(setClassesData)
      .catch((err) => {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load classes.",
        );
      })
      .finally(() => setLoading(false));
  }, [teacherEmail]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const classRows = useMemo(() => {
    if (!classesData) return [];
    return Object.entries(classesData)
      .map(([className, data]) => ({
        className,
        classId: data.classId,
      }))
      .sort((a, b) => a.className.localeCompare(b.className));
  }, [classesData]);

  const handleCopyLink = async (classId: string) => {
    const testId = selectedTestByClassId[classId]?.trim();
    if (!testId || !teacherId) return;
    const url = absoluteTestLink(teacherId, testId);
    try {
      await navigator.clipboard.writeText(url);
      setCopySnackbar(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const handlePreview = (classId: string) => {
    const testId = selectedTestByClassId[classId]?.trim();
    if (!testId || !teacherId) return;
    const params = new URLSearchParams({
      teacherID: teacherId,
      testID: testId,
    });
    navigate({ pathname: ROUTES.test, search: `?${params.toString()}` });
  };

  const rowActionsDisabled = (classId: string) =>
    !teacherId || !selectedTestByClassId[classId]?.trim();

  return (
    <Box sx={{ p: 2 }}>
      <IconButton
        aria-label="Back to Teacher portal"
        onClick={() => navigate(ROUTES.grading)}
        sx={{ mb: 2 }}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h5" gutterBottom>
        Create a Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose a test for each class, then copy the student link or open a
        preview. Students use the link to sign in and take the test; previews
        open while you are signed in as a teacher.
      </Typography>

      {!teacherId && teacherEmail && (
        <Typography color="warning.main" variant="body2" sx={{ mb: 2 }}>
          Your session has no teacher ID. Sign out and sign in again to
          generate links and previews.
        </Typography>
      )}

      {loadError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {loadError}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : classRows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {teacherEmail
            ? "No classes yet. Add classes under Manage classes."
            : "Sign in to load your classes."}
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Test scenario</TableCell>
                <TableCell align="center">Copy link</TableCell>
                <TableCell align="center">Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classRows.map(({ className, classId }) => {
                const selected = selectedTestByClassId[classId] ?? "";
                const actionsDisabled = rowActionsDisabled(classId);
                return (
                  <TableRow key={classId}>
                    <TableCell>
                      <Typography fontWeight={600}>{className}</Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth sx={{ minWidth: 200 }}>
                        <Select
                          labelId={`test-label-${classId}`}
                          value={selected}
                          displayEmpty
                          onChange={(e) =>
                            setSelectedTestByClassId((prev) => ({
                              ...prev,
                              [classId]: e.target.value as string,
                            }))
                          }
                        >
                          <MenuItem value="">
                            <em>Select a test</em>
                          </MenuItem>
                          {testScenarios.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label={`Copy test link for ${className}`}
                        onClick={() => handleCopyLink(classId)}
                        disabled={actionsDisabled}
                        color="primary"
                      >
                        <ContentCopy />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNew />}
                        disabled={actionsDisabled}
                        onClick={() => handlePreview(classId)}
                      >
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={copySnackbar}
        autoHideDuration={3000}
        onClose={() => setCopySnackbar(false)}
        message="Link copied to clipboard"
      />
    </Box>
  );
}
