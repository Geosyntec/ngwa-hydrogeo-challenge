import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Edit from '@mui/icons-material/Edit'
import PersonAdd from '@mui/icons-material/PersonAdd'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import { ROUTES } from '../../app/routes'
import {
  fetchClasses,
  updateClass,
  type ClassesResponse,
  type StudentWithId,
  type UpdateClassPayload,
} from '../../api/mockClassesApi'
import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/authSlice'

const TEACHER_NAME = 'default'
const AUTH_TOKEN_KEY = 'ngwa-auth-token'

function getAuthToken(): string {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) ?? 'mock-token'
  } catch {
    return 'mock-token'
  }
}

type EditStudentRow = { id: string; name: string; isNew?: boolean }

export default function ManageClassesPage() {
  const navigate = useNavigate()
  const authUser = useAppSelector(selectAuthUser)
  const teacherName = useMemo(() => TEACHER_NAME, [])
  const teacherId = authUser?.name ?? teacherName

  const [classesData, setClassesData] = useState<ClassesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<{
    className: string
    classId: string
    students: StudentWithId[]
  } | null>(null)
  const [editStudents, setEditStudents] = useState<EditStudentRow[]>([])
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const nextNewIdRef = useRef(0)

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

  const toggleExpanded = (className: string) => {
    setExpandedClass((prev) => (prev === className ? null : className))
  }

  const openEditModal = (className: string, classId: string, students: StudentWithId[]) => {
    setEditingClass({ className, classId, students })
    setEditStudents(
      students.map((s) => ({ id: s.id, name: s.name }))
    )
    setEditError(null)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingClass(null)
    setEditStudents([])
    setEditError(null)
  }

  const setStudentName = (index: number, name: string) => {
    setEditStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, name } : s))
    )
  }

  const addStudent = () => {
    nextNewIdRef.current += 1
    setEditStudents((prev) => [
      ...prev,
      { id: `new-${nextNewIdRef.current}`, name: '', isNew: true },
    ])
  }

  const removeStudent = (index: number) => {
    setEditStudents((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEditSubmit = async () => {
    if (!editingClass) return
    const names = editStudents.map((s) => s.name.trim()).filter(Boolean)
    if (names.length !== editStudents.length) {
      setEditError('All students must have a name.')
      return
    }
    setEditSubmitting(true)
    setEditError(null)
    const payload: UpdateClassPayload = {
      classId: editingClass.classId,
      teacherId,
      students: editStudents.map((s) =>
        s.isNew ? { name: s.name.trim() } : { id: s.id, name: s.name.trim() }
      ),
      authToken: getAuthToken(),
    }
    try {
      const res = await updateClass(payload, teacherName)
      if (res.ok) {
        closeEditModal()
        loadClasses()
      } else {
        setEditError(res.message ?? 'Update failed.')
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setEditSubmitting(false)
    }
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
        Manage Classes
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
                <TableCell padding="checkbox" sx={{ width: 48 }} />
                <TableCell>Class name</TableCell>
                <TableCell align="right">Students</TableCell>
                <TableCell padding="checkbox" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {classEntries.map(([className, classData]) => {
                const isExpanded = expandedClass === className
                const students = classData.students
                return (
                  <Fragment key={className}>
                    <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell padding="checkbox">
                        <IconButton
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          size="small"
                          onClick={() => toggleExpanded(className)}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {className}
                      </TableCell>
                      <TableCell align="right">{students.length}</TableCell>
                      <TableCell padding="checkbox">
                        <IconButton
                          aria-label="Edit class"
                          size="small"
                          onClick={() =>
                            openEditModal(className, classData.classId, students)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ py: 0, borderBottom: isExpanded ? undefined : 0 }}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, pl: 6 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Students
                            </Typography>
                            <Box
                              component="ul"
                              sx={{
                                m: 0,
                                pl: 2.5,
                                listStyle: 'disc',
                                '& li': { py: 0.25 },
                              }}
                            >
                              {students.map((s) => (
                                <li key={s.id}>
                                  <Typography component="span" variant="body2">
                                    {s.name}
                                  </Typography>
                                </li>
                              ))}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={editModalOpen} onClose={closeEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit class {editingClass?.className ?? ''}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update student names or add new students. New students will receive an
            ID when you submit.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {editStudents.map((student, index) => (
              <Box
                key={student.isNew ? student.id : student.id}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <TextField
                  size="small"
                  fullWidth
                  label="Student name"
                  value={student.name}
                  onChange={(e) => setStudentName(index, e.target.value)}
                  placeholder="Name"
                />
                <IconButton
                  aria-label="Remove student"
                  size="small"
                  onClick={() => removeStudent(index)}
                  color="error"
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Button
            startIcon={<PersonAdd />}
            onClick={addStudent}
            sx={{ mt: 2 }}
          >
            Add student
          </Button>
          {editError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {editError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={editSubmitting || editStudents.length === 0}
          >
            {editSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
