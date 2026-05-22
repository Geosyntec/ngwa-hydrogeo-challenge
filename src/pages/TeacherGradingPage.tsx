import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { ROUTES } from '../app/routes'

const PORTAL_CARDS = [
  { title: 'Manage Classes', subtitle:'Create groups of students ',route: ROUTES.gradingClasses },
  { title: 'View Grades', subtitle:'',route: ROUTES.gradingGrades },
  { title: 'Create a Test',subtitle:'', route: ROUTES.gradingCreateTest },
] as const

export default function TeacherGradingPage() {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Teacher Portal
      </Typography>


      <Box sx={{ overflowX: 'auto', width: '100%', pb: 1 }}>
        <Stack direction={{sm:'column',md:'row'}} spacing={3} sx={{flexWrap:'wrap' }}>
          {PORTAL_CARDS.map(({ title, subtitle,route }) => (
            <Card
              key={route}
              sx={{
                minWidth: 200,
                backgroundColor: theme.palette.primary.main
              }}
            >
              <CardActionArea onClick={() => navigate(route)}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h6" component="h2" color={theme.palette.primary.contrastText}>
                    {title}
                  </Typography>
                  {/* <Typography variant="body2" color={theme.palette.primary.contrastText}>
                    {subtitle}
                  </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
