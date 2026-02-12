import { Container, Typography } from '@mui/material'

export default function TeacherGradingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Teacher Grading
      </Typography>
      <Typography color="text.secondary">
        Review and grade student results. (Spec and implementation to come.)
      </Typography>
    </Container>
  )
}
