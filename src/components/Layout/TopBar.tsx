import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  selectScenarioState,
  selectScenarioByIndex,
} from '../../features/scenario/ScenarioSlice'
import { ROUTES, NAV_ITEMS } from '../../app/routes'

const brandColor = '#6CB5F4'

export default function TopBar() {
  const theme = useTheme()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { title, scenarios, scenarioIndex } = useAppSelector(selectScenarioState)
  const onChallengePage =
    location.pathname === ROUTES.scenario ||
    location.pathname.startsWith(ROUTES.scenario + '/')

  const [scenarioAnchor, setScenarioAnchor] = useState<null | HTMLElement>(null)

  const openScenarioMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setScenarioAnchor(e.currentTarget)
  }
  const closeScenarioMenu = () => setScenarioAnchor(null)
  const selectScenario = (index: number) => {
    dispatch(selectScenarioByIndex(index))
    closeScenarioMenu()
  }

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
        {/* Left: brand + scenario dropdown when on challenge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
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
          {onChallengePage && scenarios.length > 0 && (
            <Button
              size="small"
              onClick={openScenarioMenu}
              sx={{
                color: '#fff',
                textTransform: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { borderColor: brandColor, backgroundColor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <Typography variant="body2" component="span" sx={{ lineHeight: 1.2, textAlign: 'left' }}>
                {title || 'Select scenario'}
              </Typography>
              <Typography component="span" sx={{ ml: 0.5 }}>▾</Typography>
            </Button>
          )}
          <Menu
            anchorEl={scenarioAnchor}
            open={Boolean(scenarioAnchor)}
            onClose={closeScenarioMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { mt: 1.5, minWidth: 220 } }}
          >
            {scenarios.map((s, i) => (
              <MenuItem
                key={s.id}
                selected={scenarioIndex === i}
                onClick={() => selectScenario(i)}
              >
                {s.name}
              </MenuItem>
            ))}
          </Menu>
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
