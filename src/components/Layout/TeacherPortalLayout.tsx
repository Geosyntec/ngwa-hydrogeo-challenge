import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

/** Minimum width of teacher portal content; below this (inside the 80vw shell) scrolls horizontally. */
export const TEACHER_PORTAL_CONTENT_MIN_WIDTH_PX = 800

/**
 * Teacher grading routes: ~80vw centered column on grey gutters; inner content keeps
 * a fixed minimum width and scrolls instead of shrinking with the viewport.
 */
export default function TeacherPortalLayout() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: '100%',
        alignSelf: 'stretch',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          bgcolor: 'grey.300',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '80vw',
            maxWidth: '100%',
            flex: '0 0 auto',
            bgcolor: 'background.default',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              minWidth: TEACHER_PORTAL_CONTENT_MIN_WIDTH_PX,
              width: '100%',
              boxSizing: 'border-box',
              px: 2,
              py: 2,
              pb: 4,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
