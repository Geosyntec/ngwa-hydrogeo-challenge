import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Teacher Portal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Review and grade student results.
      </Typography>

      <Box sx={{ overflowX: 'auto', width: '100%', pb: 1 }}>
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'nowrap', width: 'min-content' }}>
          {PORTAL_CARDS.map(({ title, route }) => (
            <Card
              key={route}
              sx={{
                width: 300,
                minWidth: 300,
                flexShrink: 0,
              }}
            >
              <CardActionArea onClick={() => navigate(route)}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h6" component="h2">
                    {title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
