import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { ROUTES } from '../../app/routes'
import { fetchClasses, type ClassesResponse } from '../../api/mockClassesApi'

const TEACHER_NAME = 'default'

export default function ManageClassesPage() {
  const navigate = useNavigate()
  const teacherName = useMemo(() => TEACHER_NAME, [])

  const [classesData, setClassesData] = useState<ClassesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchClasses(teacherName)
      .then((data) => {
        if (!cancelled) {
          setClassesData(data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load classes')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [teacherName])

  const classEntries = useMemo(
    () => (classesData ? Object.entries(classesData) : []),
    [classesData]
  )

  const toggleExpanded = (className: string) => {
    setExpandedClass((prev) => (prev === className ? null : className))
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
              </TableRow>
            </TableHead>
            <TableBody>
              {classEntries.map(([className, students]) => {
                const isExpanded = expandedClass === className
                return (
                  <Fragment key={className}>
                    <TableRow
                      key={className}
                      hover
                      sx={{ '& > *': { borderBottom: 'unset' } }}
                    >
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
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ py: 0, borderBottom: isExpanded ? undefined : 0 }}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, pl: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
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
                              {students.map((name) => (
                                <li key={name}>
                                  <Typography component="span" variant="body2">
                                    {name}
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
    </Box>
  )
}
