import { Container, Typography } from '@mui/material'

export default function ReferencePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reference
      </Typography>
      <Typography color="text.secondary">
        Reference materials will go here.
      </Typography>
    </Container>
  )
}
