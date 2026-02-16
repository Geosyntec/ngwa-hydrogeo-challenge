import { NavLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material'
import { ROUTES, NAV_ITEMS } from '../../app/routes'

const brandColor = '#6CB5F4'

export default function TopBar() {
  const theme = useTheme()

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#222',
        color: '#fff',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: { xs: 48, sm: 56 },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left: brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography
            component="span"
            variant="h6"
            sx={{
              color: brandColor,
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Hydrogeology
          </Typography>
        </Box>

        {/* Right: nav pills with vertical rules (legacy-style) */}
        <Box
          component="nav"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& .nav-link': {
              color: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              padding: theme.spacing(1, 1.5),
              borderRadius: theme.shape.borderRadius,
              fontSize: '0.875rem',
              '&:hover': { color: brandColor, backgroundColor: 'rgba(255,255,255,0.08)' },
              '&.active': { color: brandColor, fontWeight: 600 },
            },
            '& .nav-divider': {
              width: 1,
              height: 20,
              backgroundColor: 'rgba(255,255,255,0.3)',
              margin: 0,
            },
          }}
        >
          {NAV_ITEMS.map((item, i) => (
            <Box key={item.path} component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span className="nav-divider" />}
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                end={item.path === ROUTES.home}
              >
                {item.label}
              </NavLink>
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
