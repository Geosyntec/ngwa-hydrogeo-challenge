import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import { ROUTES } from '../app/routes'
import { login as loginApi } from '../api/loginApi'
import Register from './Register'
import RecoverPassword from './RecoverPassword'

type View = 'login' | 'register' | 'recover'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.grading

  const [view, setView] = useState<View>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi({ username: username.trim(), password })
      dispatch(login({ username: res.user.name }))
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  if (view === 'register') {
    return (
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create an account to access the Teacher Portal.
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Register onBack={() => setView('login')} />
          </Box>
        </Box>
      </Container>
    )
  }

  if (view === 'recover') {
    return (
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Recover password
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <RecoverPassword onBack={() => setView('login')} />
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Teacher sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sign in to access the Teacher Portal (grading, classes, tests).
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => setView('recover')}
              sx={{ cursor: 'pointer' }}
            >
              Lost your password?
            </Link>
            <Button fullWidth variant="text" onClick={() => setView('register')} sx={{ mt: 0.5 }}>
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
