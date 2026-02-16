import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { ROUTES } from '../app/routes'

const PORTAL_CARDS = [
  { title: 'Manage Classes', route: ROUTES.gradingClasses },
  { title: 'View Grades', route: ROUTES.gradingGrades },
  { title: 'Create a Test', route: ROUTES.gradingCreateTest },
] as const

export default function TeacherGradingPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Teacher Portal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Review and grade student results.
      </Typography>

      <Grid container spacing={3}>
        {PORTAL_CARDS.map(({ title, route }) => (
          <Grid item xs={12} sm={6} md={4} key={route}>
            <Card>
              <CardActionArea onClick={() => navigate(route)}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h6" component="h2">
                    {title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
