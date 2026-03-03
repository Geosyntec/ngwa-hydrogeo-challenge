import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Visibility from '@mui/icons-material/Visibility'
import { ROUTES } from '../../app/routes'
import { fetchClasses, studentDisplayName, type ClassesResponse, type StudentWithId } from '../../api/mockClassesApi'
import { getGrades, type GetGradesResponse } from '../../api/mockGetGradesApi'
import GradesModal from './GradesModal'

const TEACHER_NAME = 'default'

export default function ViewGradesPage() {
  const navigate = useNavigate()
  const teacherName = useMemo(() => TEACHER_NAME, [])

  const [classesData, setClassesData] = useState<ClassesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [gradesLoading, setGradesLoading] = useState(false)
  const [gradesData, setGradesData] = useState<GetGradesResponse | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string
    displayName: string
  } | null>(null)

  const loadClasses = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchClasses(teacherName)
      .then(setClassesData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load classes')
      })
      .finally(() => setLoading(false))
  }, [teacherName])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  const classEntries = useMemo(
    () => (classesData ? Object.entries(classesData) : []),
    [classesData]
  )

  const openGrades = (student: StudentWithId) => {
    setSelectedStudent({ id: student.id, displayName: studentDisplayName(student) })
    setGradesData(null)
    setModalOpen(true)
    setGradesLoading(true)
    getGrades(student.id)
      .then((data) => {
        setGradesData(data)
      })
      .catch(() => {
        setGradesData(null)
      })
      .finally(() => {
        setGradesLoading(false)
      })
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedStudent(null)
    setGradesData(null)
  }

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
        View Grades
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a student to view their grade summary and individual answers.
      </Typography>

      {loading && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Loading classes…
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && classesData && (
        <TableContainer sx={{ maxWidth: 720 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classEntries.flatMap(([className, classData]) =>
                classData.students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{className}</TableCell>
                    <TableCell>{studentDisplayName(student)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => openGrades(student)}
                      >
                        View grades
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GradesModal
        open={modalOpen}
        onClose={closeModal}
        studentName={selectedStudent?.displayName ?? null}
        data={gradesData}
        loading={gradesLoading}
      />
    </Box>
  )
}
