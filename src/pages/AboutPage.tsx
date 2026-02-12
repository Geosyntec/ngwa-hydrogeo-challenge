import { Container, Typography } from '@mui/material'

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About
      </Typography>
      <Typography color="text.secondary">
        About the Hydrogeology Challenge and The Groundwater Foundation.
      </Typography>
    </Container>
  )
}
