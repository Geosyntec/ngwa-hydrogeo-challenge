import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
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

  const [copySnackbar, setCopySnackbar] = useState(false);

  const handleCopyLink = async (testId: string) => {
    if (!teacherId || !testId.trim()) return;
    const url = absoluteTestLink(teacherId, testId);
    try {
      await navigator.clipboard.writeText(url);
      setCopySnackbar(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const handlePreview = (testId: string) => {
    if (!teacherId || !testId.trim()) return;
    const params = new URLSearchParams({
      teacherID: teacherId,
      testID: testId,
    });
    navigate({ pathname: ROUTES.test, search: `?${params.toString()}` });
  };

  const actionsDisabled = !teacherId;

  return (
    <Box>
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
        Each row is a published test scenario. Copy the student link or open a
        preview. Students use the link to sign in and take the test; previews
        open while you are signed in as a teacher.
      </Typography>

      {!teacherId && teacherEmail && (
        <Typography color="warning.main" variant="body2" sx={{ mb: 2 }}>
          Your session has no teacher ID. Sign out and sign in again to
          generate links and previews.
        </Typography>
      )}

      {testScenarios.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No test scenarios are configured yet.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ overflowX: "auto", maxWidth: 640 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test scenario</TableCell>
                <TableCell align="center">Copy link</TableCell>
                <TableCell align="center">Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testScenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>
                    <Typography fontWeight={600}>{scenario.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label={`Copy test link for ${scenario.name}`}
                      onClick={() => handleCopyLink(scenario.id)}
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
                      onClick={() => handlePreview(scenario.id)}
                    >
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
