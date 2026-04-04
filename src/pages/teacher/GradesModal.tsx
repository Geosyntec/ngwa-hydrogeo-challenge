import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { GetGradesResponse } from '../../api/getGradesApi'

export type GradesModalProps = {
  open: boolean
  onClose: () => void
  studentName: string | null
  data: GetGradesResponse | null
  loading: boolean
  /** Shown when the detail request failed (not loading). */
  error?: string | null
}

export default function GradesModal({
  open,
  onClose,
  studentName,
  data,
  loading,
  error = null,
}: GradesModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {loading ? 'Loading grades…' : `Grades${studentName ? ` — ${studentName}` : ''}`}
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Typography color="text.secondary">Fetching grades…</Typography>
        )}
        {!loading && data && (
          <>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Grade summary
            </Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    Flow Direction
                  </TableCell>
                  <TableCell align="right">
                    {data.gradesSummary.flowRight} / {data.gradesSummary.flowTotal} correct
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    Gradient
                  </TableCell>
                  <TableCell align="right">
                    {data.gradesSummary.gradientRight} / {data.gradesSummary.gradientTotal} correct
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    Horizontal Velocity
                  </TableCell>
                  <TableCell align="right">
                    {data.gradesSummary.velocityRight} / {data.gradesSummary.velocityTotal} correct
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                    Overall grade
                  </TableCell>
                  <TableCell align="right">
                    {data.gradesSummary.percentage}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Accordion variant="outlined" sx={{ '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Individual answers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table size="small">
                  <TableBody>
                    {Object.entries(data.answers).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            verticalAlign: 'top',
                          }}
                        >
                          {key}
                        </TableCell>
                        <TableCell align="right">{String(value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {!loading && error && (
          <Typography color="error">{error}</Typography>
        )}
        {!loading && !error && !data && (
          <Typography color="text.secondary">No grades data.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
