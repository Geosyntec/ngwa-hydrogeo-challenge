import { useNavigate } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { ROUTES } from '../../app/routes'

export default function CreateTestPage() {
  const navigate = useNavigate()

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
      <Box sx={{ minHeight: 200 }} />
    </Box>
  )
}
