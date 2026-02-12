import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import { ROUTES } from '../app/routes'

export default function GettingStartedPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Getting Started
      </Typography>
      <Typography color="text.secondary" paragraph>
        Instructions and background for the Hydrogeology Challenge will go here.
      </Typography>
      <Button component={Link} to={ROUTES.scenario} variant="contained">
        Start The Challenge
      </Button>
    </Container>
  )
}
