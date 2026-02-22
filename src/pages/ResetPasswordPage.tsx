import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import { validatePassword } from '../utils/passwordValidation'
import { setNewPassword } from '../api/mockNewPasswordApi'
import { ROUTES } from '../app/routes'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('username') ?? searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const missingParams = useMemo(() => !email || !token, [email, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const validation = validatePassword(password)
    if (!validation.valid) {
      setError(validation.errors[0] ?? 'Invalid password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await setNewPassword({
        email: email.trim(),
        newPassword: password,
        token,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  if (missingParams) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 8, textAlign: 'center' }}>
          <Typography color="error">
            Invalid reset link. Please use the link from your password reset email.
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(ROUTES.login)}>
            Go to sign in
          </Button>
        </Box>
      </Container>
    )
  }

  if (success) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 8, textAlign: 'center' }}>
          <Typography color="success.main" sx={{ mb: 2 }}>
            Your password has been updated. You can now sign in with your new password.
          </Typography>
          <Button variant="contained" onClick={() => navigate(ROUTES.login)}>
            Sign in
          </Button>
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
          Set new password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter and confirm your new password below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={email}
            disabled
            helperText="From reset link"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New password"
            type="password"
            id="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Longer than 8 characters, with a capital letter, number, and special character."
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Updating…' : 'Update password'}
          </Button>
          <Button fullWidth onClick={() => navigate(ROUTES.login)}>
            Back to sign in
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
