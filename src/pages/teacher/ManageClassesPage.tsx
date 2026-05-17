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
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import PersonAdd from '@mui/icons-material/PersonAdd'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import Delete from '@mui/icons-material/Delete'
import { ROUTES } from '../../app/routes'
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  studentDisplayName,
  type ClassesResponse,
  type StudentWithId,
  type UpdateClassPayload,
} from '../../api/classesApi'
import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/authSlice'

const AUTH_TOKEN_KEY = 'ngwa-auth-token'

function getAuthToken(): string {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) ?? 'mock-token'
  } catch {
    return 'mock-token'
  }
}

type EditStudentRow = { id: string; first_name: string; last_name: string; isNew?: boolean }

export default function ManageClassesPage() {
  const navigate = useNavigate()
  const authUser = useAppSelector(selectAuthUser)
  const teacherEmail = (authUser?.name ?? '').trim()

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
  const [deleteConfirm, setDeleteConfirm] = useState<{ className: string; classId: string } | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [studentDeleteConfirm, setStudentDeleteConfirm] = useState<{
    index: number
    displayName: string
  } | null>(null)
  const nextNewIdRef = useRef(0)

  const loadClasses = useCallback(() => {
    if (!teacherEmail) {
      setClassesData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetchClasses(teacherEmail)
      .then(setClassesData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load classes')
      })
      .finally(() => setLoading(false))
  }, [teacherEmail])

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

  const [editClassName, setEditClassName] = useState('')

  const openEditModal = (className: string, classId: string, students: StudentWithId[]) => {
    setEditingClass({ className, classId, students })
    setEditClassName(className)
    setEditStudents(
      students.map((s) => ({ id: s.id, first_name: s.first_name, last_name: s.last_name }))
    )
    setEditError(null)
    setEditModalOpen(true)
  }

  const openAddModal = () => {
    setEditingClass(null)
    setEditClassName('')
    setEditStudents([])
    setEditError(null)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingClass(null)
    setEditClassName('')
    setEditStudents([])
    setEditError(null)
    setStudentDeleteConfirm(null)
  }

  const setStudentFirst = (index: number, first_name: string) => {
    setEditStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, first_name } : s))
    )
  }
  const setStudentLast = (index: number, last_name: string) => {
    setEditStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, last_name } : s))
    )
  }

  const addStudent = () => {
    nextNewIdRef.current += 1
    setEditStudents((prev) => [
      ...prev,
      { id: `new-${nextNewIdRef.current}`, first_name: '', last_name: '', isNew: true },
    ])
  }

  const removeStudent = (index: number) => {
    setEditStudents((prev) => prev.filter((_, i) => i !== index))
    setStudentDeleteConfirm((pending) =>
      pending?.index === index ? null : pending,
    )
  }

  const requestRemoveStudent = (index: number) => {
    const student = editStudents[index]
    if (!student) return
    if (student.isNew) {
      removeStudent(index)
      return
    }
    const name = [student.first_name, student.last_name]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ')
    setStudentDeleteConfirm({
      index,
      displayName: name || 'this student',
    })
  }

  const confirmRemoveStudent = () => {
    if (studentDeleteConfirm === null) return
    removeStudent(studentDeleteConfirm.index)
  }

  const handleDeleteClass = async () => {
    if (!deleteConfirm || !teacherEmail) return
    setDeleteSubmitting(true)
    try {
      await deleteClass(deleteConfirm.classId, teacherEmail)
      setDeleteConfirm(null)
      loadClasses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class.')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const handleEditSubmit = async () => {
    const allHaveName = editStudents.every(
      (s) => s.first_name.trim() !== '' || s.last_name.trim() !== ''
    )
    if (!allHaveName) {
      setEditError('All students must have a first or last name.')
      return
    }
    setEditSubmitting(true)
    setEditError(null)
    try {
      if (editingClass) {
        const payload: UpdateClassPayload = {
          classId: editingClass.classId,
          teacherId: teacherEmail,
          students: editStudents.map((s) =>
            s.isNew
              ? { first_name: s.first_name.trim(), last_name: s.last_name.trim() }
              : { id: s.id, first_name: s.first_name.trim(), last_name: s.last_name.trim() }
          ),
          authToken: getAuthToken(),
        }
        const res = await updateClass(payload, teacherEmail)
        if (res.ok) {
          closeEditModal()
          loadClasses()
        } else {
          setEditError(res.message ?? 'Update failed.')
        }
      } else {
        const name = editClassName.trim()
        if (!name) {
          setEditError('Class name is required.')
          setEditSubmitting(false)
          return
        }
        await createClass(
          teacherEmail,
          name,
          editStudents.map((s) => ({
            first_name: s.first_name.trim(),
            last_name: s.last_name.trim(),
          }))
        )
        closeEditModal()
        loadClasses()
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setEditSubmitting(false)
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
        <>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddModal}
            disabled={!teacherEmail}
            sx={{ mb: 2 }}
          >
            Add class
          </Button>
          <TableContainer sx={{ overflowX: 'auto', maxWidth: 640 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 48 }} />
                <TableCell>Class name</TableCell>
                <TableCell align="right">Students</TableCell>
                <TableCell padding="checkbox" sx={{ width: 48 }} />
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
                      <TableCell padding="checkbox">
                        <IconButton
                          aria-label="Delete class"
                          size="small"
                          onClick={() => setDeleteConfirm({ className, classId: classData.classId })}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
                                    {studentDisplayName(s)}
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
        </>
      )}

      <Dialog open={editModalOpen} onClose={closeEditModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{mb:2}}>
          {editingClass ? `Edit class ${editingClass.className}` : 'Add new class'}
        </DialogTitle>
        <DialogContent>
          {!editingClass && (
            <TextField
              autoFocus
              fullWidth
              label="Class name"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              placeholder="e.g. Hydrogeology 101"
              sx={{ mb: 2 }}
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {editingClass
              ? 'Update student first and last names or add new students. New students will receive an ID when you submit.'
              : 'Optionally add students now. You can add more later by editing the class. Note that class names will be visible to students when taking tests.'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {editStudents.map((student, index) => (
              <Box
                key={student.isNew ? student.id : student.id}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
              >
                <TextField
                  size="small"
                  label="First name"
                  value={student.first_name}
                  onChange={(e) => setStudentFirst(index, e.target.value)}
                  placeholder="First"
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  size="small"
                  label="Last name"
                  value={student.last_name}
                  onChange={(e) => setStudentLast(index, e.target.value)}
                  placeholder="Last"
                  sx={{ minWidth: 120 }}
                />
                <IconButton
                  aria-label="Remove student"
                  size="small"
                  onClick={() => requestRemoveStudent(index)}
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
            disabled={
              editSubmitting ||
              (editingClass ? editStudents.length === 0 : !editClassName.trim())
            }
          >
            {editSubmitting ? 'Saving…' : editingClass ? 'Save changes' : 'Create class'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!studentDeleteConfirm}
        onClose={() => setStudentDeleteConfirm(null)}
      >
        <DialogTitle>Delete student</DialogTitle>
        <DialogContent>
          <Typography>
            Remove &quot;{studentDeleteConfirm?.displayName}&quot; from this class? Any test
            results associated with this student will be deleted. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemoveStudent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => !deleteSubmitting && setDeleteConfirm(null)}>
        <DialogTitle>Delete class</DialogTitle>
        <DialogContent>
          <Typography>
            Delete class &quot;{deleteConfirm?.className}&quot;? This will remove the class and all
            its students. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} disabled={deleteSubmitting}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteClass} disabled={deleteSubmitting}>
            {deleteSubmitting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
