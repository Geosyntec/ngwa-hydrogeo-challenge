import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
