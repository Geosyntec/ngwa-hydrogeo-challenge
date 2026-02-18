import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from '@mui/material'
import Home from '@mui/icons-material/Home'
import Replay from '@mui/icons-material/Replay'

export type SubmitResultsModalProps = {
  open: boolean
  onClose: () => void
  flowRight: number
  flowTotal: number
  gradientRight: number
  gradientTotal: number
  velocityRight: number
  velocityTotal: number
  onResetChallenge: () => void
  onReturnHome: () => void
}

export default function SubmitResultsModal({
  open,
  onClose,
  flowRight,
  flowTotal,
  gradientRight,
  gradientTotal,
  velocityRight,
  velocityTotal,
  onResetChallenge,
  onReturnHome,
}: SubmitResultsModalProps) {
  const totalRight = flowRight + gradientRight + velocityRight
  const totalQuestions = flowTotal + gradientTotal + velocityTotal
  const percentage = totalQuestions > 0 ? Math.round((totalRight / totalQuestions) * 100) : 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Challenge results</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 0.5 }}>
          <Typography variant="body1">
            <strong>Flow Direction:</strong> {flowRight} / {flowTotal} correct
          </Typography>
          <Typography variant="body1">
            <strong>Gradient:</strong> {gradientRight} / {gradientTotal} correct
          </Typography>
          <Typography variant="body1">
            <strong>Horizontal Velocity:</strong> {velocityRight} / {velocityTotal} correct
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Overall grade: {percentage}%
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<Replay />}
          onClick={onResetChallenge}
          fullWidth
        >
          Reset challenge
        </Button>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={onReturnHome}
          fullWidth
        >
          Return home
        </Button>
      </DialogActions>
    </Dialog>
  )
}
