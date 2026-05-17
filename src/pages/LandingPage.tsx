import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import { ROUTES } from '../app/routes'

// type PingStatus = 'idle' | 'loading' | 'success' | 'error'

export default function LandingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Aquifer Lab
        </Typography>
        <Typography variant="h6" color="#000000" align="left" sx={{ mb: 4 }}>
        The Groundwater Foundation present Aquifer Lab, a learning tool designed to introduce 
        basic groundwater modeling concepts to the eager student. It uses simple calculations 
        and assumptions to present groundwater flow in a fun and easy to understand way. 
        For more information about the Aquifer Lab and additional learning materials
         visit the Aquifer Lab page.
        </Typography>
        <Button
          component={Link}
          to={ROUTES.scenario}
          variant="contained"
          size="large"
        >
          Take the Challenge
        </Button>
      </Box>
      <Box>
      <Typography variant="body1" align="center" color="primary">
          Created by NGWA and Geosyntec Consultants Inc.
        </Typography>
        <Typography variant="body2" align="center" color="primary">
          Version 1.0.0
        </Typography>
      </Box>
    </Container>
  )
}
