import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/authSlice'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Visibility from '@mui/icons-material/Visibility'
import RestartAlt from '@mui/icons-material/RestartAlt'
import { ROUTES } from '../../app/routes'
import { studentDisplayName } from '../../api/classesApi'
import {
  fetchTeacherGrades,
  fetchGradeSubmissionDetail,
  deleteGradeSubmissionsForStudentScenario,
  type GetGradesResponse,
  type TeacherGradeSubmissionRow,
} from '../../api/getGradesApi'
import { testScenarios } from '../../features/scenario/testScenario'
import GradesModal from './GradesModal'

type ClassGroup = {
  classId: string
  className: string
  rows: TeacherGradeSubmissionRow[]
}

type TestGroup = {
  scenarioId: string
  classes: ClassGroup[]
}

function scenarioHeading(scenarioId: string): string {
  const t = testScenarios.find((s) => s.id === scenarioId)
  return t ? `${t.name} Test Results` : scenarioId
}

function buildGroups(submissions: TeacherGradeSubmissionRow[]): TestGroup[] {
  const byTest = new Map<string, Map<string, ClassGroup>>()
  for (const r of submissions) {
    if (!byTest.has(r.scenario_id)) {
      byTest.set(r.scenario_id, new Map())
    }
    const cm = byTest.get(r.scenario_id)!
    if (!cm.has(r.class_id)) {
      cm.set(r.class_id, {
        classId: r.class_id,
        className: r.class_name,
        rows: [],
      })
    }
    cm.get(r.class_id)!.rows.push(r)
  }
  const scenarioIds = [...byTest.keys()].sort((a, b) => a.localeCompare(b))
  return scenarioIds.map((scenarioId) => {
    const cm = byTest.get(scenarioId)!
    const classes = [...cm.values()]
      .map((c) => ({
        ...c,
        rows: [...c.rows].sort((a, b) => {
          const ln = a.last_name.localeCompare(b.last_name)
          if (ln !== 0) return ln
          return a.first_name.localeCompare(b.first_name)
        }),
      }))
      .sort((a, b) => a.className.localeCompare(b.className))
    return { scenarioId, classes }
  })
}

export default function ViewGradesPage() {
  const navigate = useNavigate()
  const authUser = useAppSelector(selectAuthUser)
  const teacherEmail = (authUser?.name ?? '').trim()
  const teacherUserId = (authUser?.id ?? '').trim() || undefined

  const [submissions, setSubmissions] = useState<TeacherGradeSubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [gradesLoading, setGradesLoading] = useState(false)
  const [gradesData, setGradesData] = useState<GetGradesResponse | null>(null)
  const [gradeDetailError, setGradeDetailError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<{
    displayName: string
  } | null>(null)
  const [resettingKey, setResettingKey] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)

  const loadGrades = useCallback((): Promise<void> => {
    if (!teacherEmail) {
      setSubmissions([])
      setLoading(false)
      return Promise.resolve()
    }
    setLoading(true)
    setError(null)
    return fetchTeacherGrades(teacherEmail, teacherUserId)
      .then((res) => setSubmissions(res.submissions))
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load grades')
        setSubmissions([])
      })
      .finally(() => setLoading(false))
  }, [teacherEmail, teacherUserId])

  useEffect(() => {
    loadGrades()
  }, [loadGrades])

  const grouped = useMemo(() => buildGroups(submissions), [submissions])

  const openGrades = (row: TeacherGradeSubmissionRow) => {
    setSelectedStudent({
      displayName: studentDisplayName({
        id: row.student_id,
        first_name: row.first_name,
        last_name: row.last_name,
      }),
    })
    setGradesData(null)
    setGradeDetailError(null)
    setModalOpen(true)
    setGradesLoading(true)
    fetchGradeSubmissionDetail(row.submission_id, teacherEmail, teacherUserId)
      .then((data) => {
        setGradesData(data)
      })
      .catch((err) => {
        setGradesData(null)
        setGradeDetailError(
          err instanceof Error ? err.message : 'Failed to load submission.',
        )
      })
      .finally(() => {
        setGradesLoading(false)
      })
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedStudent(null)
    setGradesData(null)
    setGradeDetailError(null)
  }

  const handleResetSubmission = async (row: TeacherGradeSubmissionRow) => {
    if (
      !window.confirm(
        'Delete all stored submissions for this student on this test? They will be able to take the test again.',
      )
    ) {
      return
    }
    setResetError(null)
    const key = `${row.student_id}:${row.scenario_id}`
    setResettingKey(key)
    try {
      await deleteGradeSubmissionsForStudentScenario(
        row.student_id,
        row.scenario_id,
        teacherEmail,
        teacherUserId,
      )
      await loadGrades()
    } catch (err) {
      setResetError(
        err instanceof Error ? err.message : 'Failed to reset submission.',
      )
    } finally {
      setResettingKey(null)
    }
  }

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
        View Grades
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
       Grades are grouped by class. Open a section to see each student&apos;s
        latest submission for that test. Click the 'View' button to see the full list of submitted answers.
        Click the 'Reset' button to remove all test data for that student so they can retake the test.
      </Typography>

      {resetError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {resetError}
        </Typography>
      )}

      {!teacherEmail && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Sign in as a teacher to view grades.
        </Typography>
      )}

      {teacherEmail && loading && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Loading grades…
        </Typography>
      )}

      {teacherEmail && error && (
        <Typography color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      )}

      {teacherEmail && !loading && !error && grouped.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No submissions yet for your classes.
        </Typography>
      )}

      {teacherEmail && !loading && !error && grouped.length > 0 && (
        <Box sx={{ width: '100%' }}>
          {grouped.map((test) => (
            <Accordion
              key={test.scenarioId}
              defaultExpanded={true}
              disableGutters
              elevation={0}
              sx={{
                mb: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {scenarioHeading(test.scenarioId)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {test.classes.map((cls) => (
                  <Accordion
                    key={cls.classId}
                    disableGutters
                    elevation={0}
                    sx={{
                      mb: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">{cls.className}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Student</TableCell>
                              <TableCell align="right">Overall</TableCell>
                              <TableCell align="right">Flow</TableCell>
                              <TableCell align="right">Gradient</TableCell>
                              <TableCell align="right">Velocity</TableCell>
                              <TableCell>Submitted</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cls.rows.map((row) => (
                              <TableRow key={row.submission_id} hover>
                                <TableCell>
                                  {studentDisplayName({
                                    id: row.student_id,
                                    first_name: row.first_name,
                                    last_name: row.last_name,
                                  })}
                                </TableCell>
                                <TableCell align="right">{row.percentage}%</TableCell>
                                <TableCell align="right">
                                  {row.flow_right}/{row.flow_total}
                                </TableCell>
                                <TableCell align="right">
                                  {row.gradient_right}/{row.gradient_total}
                                </TableCell>
                                <TableCell align="right">
                                  {row.velocity_right}/{row.velocity_total}
                                </TableCell>
                                <TableCell>
                                  {row.submitted_at
                                    ? new Date(row.submitted_at).toLocaleString()
                                    : '—'}
                                </TableCell>
                                <TableCell align="right">
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    justifyContent="flex-end"
                                    flexWrap="wrap"
                                  >
                                    <Button
                                      size="small"
                                      startIcon={<Visibility />}
                                      onClick={() => openGrades(row)}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="small"
                                      color="warning"
                                      variant="outlined"
                                      startIcon={<RestartAlt />}
                                      disabled={resettingKey === `${row.student_id}:${row.scenario_id}`}
                                      onClick={() => handleResetSubmission(row)}
                                    >
                                      Reset
                                    </Button>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <GradesModal
        open={modalOpen}
        onClose={closeModal}
        studentName={selectedStudent?.displayName ?? null}
        data={gradesData}
        loading={gradesLoading}
        error={gradeDetailError}
      />
    </Box>
  )
}
