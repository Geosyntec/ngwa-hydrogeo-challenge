import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import { ROUTES } from '../app/routes'
import { getApiUrl } from '../app/apiConfig'

// type PingStatus = 'idle' | 'loading' | 'success' | 'error'

export default function LandingPage() {
  // const [pingStatus, setPingStatus] = useState<PingStatus>('idle')

  // useEffect(() => {
  //   let cancelled = false
  //   setPingStatus('loading')
  //   fetch(`${getApiUrl()}/api/ping`)
  //     .then(async (res) => {
  //       if (cancelled) return
  //       if (!res.ok) {
  //         setPingStatus('error')
  //         return
  //       }
  //       const data = await res.json()
  //       if (data === true) {
  //         setPingStatus('success')
  //       } else {
  //         setPingStatus('error')
  //       }
  //     })
  //     .catch(() => {
  //       if (!cancelled) setPingStatus('error')
  //     })
  //   return () => {
  //     cancelled = true
  //   }
  // }, [])

  // if (pingStatus === 'loading') {
  //   return (
  //     <Container maxWidth="md" sx={{ py: 4 }}>
  //       <Box sx={{ textAlign: 'center', py: 6 }}>
  //         <Typography color="text.secondary">Connecting to server…</Typography>
  //       </Box>
  //     </Container>
  //   )
  // }

  // if (pingStatus === 'error') {
  //   throw new Error('500') // 500 error: backend unreachable or ping failed
  // }

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
