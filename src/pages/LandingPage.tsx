import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import { ROUTES } from '../app/routes'

export default function LandingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Hydrogeology Challenge
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Learn groundwater flow direction, gradient, and velocity using well data.
        </Typography>
        <Button
          component={Link}
          to={ROUTES.gettingStarted}
          variant="outlined"
          size="large"
          sx={{ mr: 2 }}
        >
          Getting Started
        </Button>
        <Button
          component={Link}
          to={ROUTES.scenario}
          variant="contained"
          size="large"
        >
          The Challenge
        </Button>
      </Box>
    </Container>
  )
}
